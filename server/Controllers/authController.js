import jwt from 'jsonwebtoken'
import Auth from '../Models/auth.js'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

// Create User
export const registerUser = async (req, res) => {
    try {
        const { password, email, userName, role } = req.body
        if (!password) {
            return res.status(401).json({ success: false, message: "Password is required" })
        }
        if (!email) {
            return res.status(401).json({ success: false, message: "Email is required" })
        }
        if (!userName) {
            return res.status(401).json({ success: false, message: "User Name is required" })
        }
        if (!role) {
            return res.status(401).json({ success: false, message: "Role is required" })
        }

        const findUser = await Auth.findOne({ email })
        if (findUser) {
            return res.status(400).json({ success: false, message: "Existing account" })
        }

        const salt = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(password, salt)
        const createNewUser = new Auth({
            email, password: hashedPassword, userName, role
        })

        await createNewUser.save()

        if (createNewUser) {
            res.status(201).json({ success: true, message: "Success" })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Registration failed" });
    }
}

// Login admin user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        // Find user and ensure they are an admin
        const user = await Auth.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Verify user is an admin
        if (user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1d" }
        );

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        // Send response
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error during login"
        });
    }
};

// Logout admin user
export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error during logout"
        });
    }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please provide an email address"
            });
        }

        const user = await Auth.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No user found with this email address"
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour

        // Save reset token to user
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        // Create reset URL
        const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`;

        // Create email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <h1>Password Reset Request</h1>
                <p>You requested a password reset. Please click the link below to reset your password:</p>
                <a href="${resetUrl}">Reset Password</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: "Password reset email sent"
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: "Error processing password reset request"
        });
    }
};

// Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Token and new password are required"
            });
        }

        const user = await Auth.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user password and clear reset token
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password has been reset successfully"
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: "Error resetting password"
        });
    }
};

// Create Admin Account
export const createAdmin = async (req, res) => {
    try {
        const { userName, email, password, role } = req.body;

        // Validate input
        if (!userName || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if user already exists
        const existingUser = await Auth.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new admin user
        const newAdmin = new Auth({
            userName,
            email,
            password: hashedPassword,
            role
        });

        await newAdmin.save();

        res.status(201).json({
            success: true,
            message: "Admin account created successfully"
        });

    } catch (error) {
        console.error('Create admin error:', error);
        res.status(500).json({
            success: false,
            message: "Error creating admin account"
        });
    }
};

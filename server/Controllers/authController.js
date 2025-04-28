import jwt from 'jsonwebtoken'
import Auth from '../Models/auth.js'
import bcrypt from 'bcryptjs'

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
            return res.status(400).json({ success: false, message: "Exisisting account" })
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
        console.error("Register error", error.message);
        res.status(500).json({ success: false, message: "Registration failed" });
    }
}
// Login User Controller
export const loginUser = async (req, res) => {
    try {
        const { password, email } = req.body;
        if (!password || !email) {
            return res.status(400).json({ success: false, message: "Email and Password are required" });
        }
        const existingUser = await Auth.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect password" });
        }

        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: "60min" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            // sameSite: 'Strict',
            // maxAge: 3600000 
        });

        res.status(200).json({ success: true, message: "Login successful", token, user: existingUser });

    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ success: false, message: "Login failed" });
    }
};

// Logout User Controller
export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,  // Ensure `secure: true` in production
            sameSite: 'Strict',
            path: "/"
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: "Error Occurred" });
    }
};

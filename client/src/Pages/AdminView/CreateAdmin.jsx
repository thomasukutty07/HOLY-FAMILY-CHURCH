import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, User, Lock, Shield, ArrowLeft } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CreateAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.userName) {
      newErrors.userName = "Username is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/church/auth/create-admin",
        {
          userName: formData.userName,
          email: formData.email,
          password: formData.password,
          role: "admin",
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Admin account created successfully");
        setFormData({
          userName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        toast.error(response.data.message || "Failed to create admin account");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="w-full max-w-6xl flex items-center justify-center gap-12 px-4">
        {/* Left side - Form */}
        <div className="w-[400px] flex flex-col gap-6 relative">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-50 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
          </div>
          
          {/* Header Section with Back Button */}
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/admin/dashboard")}
              className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 -ml-2"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </Button>
          </div>
          
          {/* Logo and Welcome Section */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition-all duration-300 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Create Admin Account
              </h1>
              <p className="text-gray-600 mt-1 text-sm">
                Set up a new administrator account for the church management system
              </p>
            </div>
            </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-1">
              <label htmlFor="userName" className="text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                  </div>
                <input
                    type="text"
                    id="userName"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    placeholder="Enter username"
                  className={`w-full pl-10 pr-4 py-2.5 border ${errors.userName ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white/80 backdrop-blur-sm transition-all duration-200 shadow-sm`}
                  required
                  />
                {errors.userName && (
                  <p className="mt-1 text-sm text-red-500 animate-fade-in">{errors.userName}</p>
                )}
              </div>
              </div>

            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                  </div>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                  className={`w-full pl-10 pr-4 py-2.5 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white/80 backdrop-blur-sm transition-all duration-200 shadow-sm`}
                  required
                  />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500 animate-fade-in">{errors.email}</p>
                )}
              </div>
              </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                  </div>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                  className={`w-full pl-10 pr-4 py-2.5 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white/80 backdrop-blur-sm transition-all duration-200 shadow-sm`}
                  required
                  />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500 animate-fade-in">{errors.password}</p>
                )}
              </div>
              </div>

            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                  </div>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                  className={`w-full pl-10 pr-4 py-2.5 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white/80 backdrop-blur-sm transition-all duration-200 shadow-sm`}
                  required
                  />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500 animate-fade-in">{errors.confirmPassword}</p>
                )}
              </div>
              </div>

            <button
                type="submit"
                disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 px-4 rounded-xl hover:opacity-90 transition-all duration-200 flex justify-center items-center text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Admin...
                  </span>
                ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Create Admin Account
                </>
                )}
            </button>
            </form>
        </div>

        {/* Right side - Decorative Element */}
        <div className="hidden lg:block w-[500px] h-[600px] relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl backdrop-blur-sm">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full opacity-20 blur-3xl"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-6">
              <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition-all duration-300 shadow-lg mx-auto">
                <Shield className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-700">Church Management System</h2>
              <p className="text-gray-600 max-w-sm mx-auto">
                Create and manage administrator accounts to help run your church efficiently
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAdmin; 
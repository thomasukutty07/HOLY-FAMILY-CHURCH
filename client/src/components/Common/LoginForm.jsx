import React, { useState } from "react";
import { loginUser } from "@/Store/User/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const LoginForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "admin",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await dispatch(loginUser(formData));
      if (result?.payload?.success) {
        toast.success(result.payload?.message);
        // You could add redirect logic here if needed
      } else {
        toast.error(result?.payload?.message || "Login failed");
      }
    } catch (error) {
      toast.error("An error occurred during login");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div>
        <h1 className="font-corporates text-5xl bg-clip-text text-transparent bg-gradient-to-br from-[#A22FCE] to-[#FF7000]">
          Admin Login
        </h1>
        <p className="text-gray-600 mt-2">
          Authorized users only. Please authenticate to proceed
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 bg-gradient-to-r from-[#A22FCE] to-[#FF7000] text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity duration-200 flex justify-center items-center"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing In...
            </span>
          ) : (
            "Sign In"
          )}
        </button>
        
        <div className="text-center mt-2">
          <a href="#" className="text-sm text-purple-600 hover:text-purple-800">
            Forgot password?
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
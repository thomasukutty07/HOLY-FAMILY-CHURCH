import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useSelector } from "react-redux";

const PageNotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleNavigation = () => {
    const isAdminSection = location.pathname.startsWith('/admin');
    
    if (isAdminSection) {
      navigate("/admin/dashboard", { replace: true });
    } else {
      navigate("/church/home", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-900 mb-4">404</h1>
          <div className="h-1 w-20 bg-indigo-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <Button
          onClick={handleNavigation}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
        >
          <Home className="h-5 w-5" />
          {location.pathname.startsWith('/admin') ? "Go to Dashboard" : "Return Home"}
        </Button>
      </div>
    </div>
  );
};

export default PageNotFound;

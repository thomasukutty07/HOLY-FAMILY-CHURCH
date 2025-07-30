import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CheckAuth = ({ children, isAuthenticated, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const role = user?.role;

  useEffect(() => {
    const path = location.pathname;

    // Handle unauthenticated users trying to access admin routes
    if (!isAuthenticated && path.includes("admin")) {
      navigate("/auth/login");
      return;
    }

    // Handle authenticated users with admin/vicar roles
    const isAdminOrVicar = role === "admin" || role === "vicar";
    if (isAuthenticated && isAdminOrVicar) {
      // If trying to access church routes, redirect to admin dashboard
      if (path.includes("church")) {
        navigate("/admin/dashboard");
        return;
      }
      // If trying to access auth routes, redirect to admin dashboard
      if (path.includes("auth")) {
        navigate("/admin/dashboard");
        return;
      }
    }

    // Handle authenticated users without admin/vicar roles
    if (isAuthenticated && !isAdminOrVicar) {
      // If trying to access admin routes, redirect to church home
      if (path.includes("admin")) {
        navigate("/church/home");
        return;
      }
    }
  }, [isAuthenticated, role, location.pathname, navigate]);

  // Only render children if the user has the correct role for the current route
  const isAdminOrVicar = role === "admin" || role === "vicar";
  const isAdminRoute = location.pathname.includes("admin");
  
  if (isAdminRoute && !isAdminOrVicar) {
    return null;
  }

  return <>{children}</>;
};

export default CheckAuth;

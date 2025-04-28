import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CheckAuth = ({ children, isAuthenticated, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const role = user?.role;

  useEffect(() => {
    const path = location.pathname;

    if (!isAuthenticated && path.includes("admin")) {
      navigate("/church/home");
      return;
    }

    const isAdminOrVicar = role === "admin" || role === "vicar";

    if (isAuthenticated && isAdminOrVicar) {
      if (path.includes("church") || path.includes("auth")) {
        navigate("/admin/dashboard");
        return;
      }
    }
  }, [isAuthenticated, role, location.pathname, navigate]);

  return <>{children}</>;
};

export default CheckAuth;

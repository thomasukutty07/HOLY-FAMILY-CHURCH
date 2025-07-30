import React, { useEffect, useCallback } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import HomeLayout from "./components/Layout/HomeLayout";
import ChurchLayout from "./components/Layout/ChurchLayout";
import Leaders from "./Pages/ClientView/Leaders";
import AdminLayout from "./components/Layout/AdminLayout";
import Dashboard from "./Pages/AdminView/Dashboard";
import AddMember from "./Pages/AdminView/Member/AddMember";
import CreateFamily from "./Pages/AdminView/Family/CreateFamily";
import CheckAuth from "./CheckAuth";
import CreateGroup from "./Pages/AdminView/Group/CreateGroup";
import { Toaster } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import Login from "./Pages/AdminView/Login";
import LoginLayout from "./components/Layout/LoginLayout";
import PageNotFound from "./components/Common/PageNotFound";
import { checkAuth } from "./Store/User/authSlice";
import ShowAllFamilies from "./Pages/AdminView/Family/ShowAllFamilies";
import ShowAllMembers from "./Pages/AdminView/Member/ShowAllMembers";
import ShowAllGroups from "./Pages/AdminView/Group/ShowAllGroups";
import Calendar from "./Pages/AdminView/Calendar/Calendar";
import ForgotPassword from "./components/Common/ForgotPassword";
import ResetPassword from "./components/Common/ResetPassword";
import CreateAdmin from "./Pages/AdminView/CreateAdmin";
import RoleDetails from "./Pages/ClientView/RoleDetails";
import AboutAndHistory from "./components/ClientView/AboutAndHistory";
import ClientHome from "./components/ClientView/ClientHome";
import BirthdaysPage from "./Pages/ClientView/Birthdays";

// New component to check church access
const CheckChurchAuth = ({ children, isAuthenticated, user }) => {
  const navigate = useNavigate();
  const role = user?.role;
  const isAdminOrVicar = role === "admin" || role === "vicar";

  useEffect(() => {
    if (isAuthenticated && isAdminOrVicar) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, isAdminOrVicar, navigate]);

  if (isAuthenticated && isAdminOrVicar) {
    return null;
  }

  return <>{children}</>;
};

const App = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAuthCheck = useCallback(async () => {
    try {
      const data = await dispatch(checkAuth());
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      const isAuthRoute = window.location.pathname.startsWith('/auth');

      if (data?.payload?.success && data?.payload?.user) {
        // User is authenticated
        if (isAuthRoute) {
          // If on auth route (like login), redirect to admin dashboard
          navigate("/admin/dashboard");
        }
      } else {
        // User is not authenticated
        if (isAdminRoute) {
          // If on admin route but not authenticated, redirect to login
          navigate("/auth/login");
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      // If there's an error and we're on an admin route, redirect to login
      if (window.location.pathname.startsWith('/admin')) {
        navigate("/auth/login");
      }
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    // Check authentication on initial load
    handleAuthCheck();

    // Set up an interval to periodically check authentication
    const authCheckInterval = setInterval(handleAuthCheck, 5 * 60 * 1000); // Check every 5 minutes

    return () => {
      clearInterval(authCheckInterval);
    };
  }, [handleAuthCheck]);

  const renderRoutes = useCallback(() => (
    <Routes>
      {/* Public Church Routes */}
      <Route path="/church" element={<ChurchLayout />}>
        <Route index element={<HomeLayout />} />
        <Route path="home" element={<HomeLayout />}>
          <Route index element={<ClientHome />} />
          <Route path="birthdays" element={<BirthdaysPage />} />
        </Route>
        <Route path="leaders" element={<Leaders />} />
        <Route path="about" element={<AboutAndHistory />} />
        <Route path="role-details" element={<RoleDetails />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AdminLayout />
          </CheckAuth>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="add-member" element={<AddMember />} />
        <Route path="create-family" element={<CreateFamily />} />
        <Route path="create-group" element={<CreateGroup />} />
        <Route path="members" element={<ShowAllMembers />} />
        <Route path="families" element={<ShowAllFamilies />} />
        <Route path="groups" element={<ShowAllGroups />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="create-admin" element={<CreateAdmin />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/auth" element={<LoginLayout />}>
        <Route index element={<Navigate to="/auth/login" replace />} />
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
      </Route>

      {/* Root route */}
      <Route path="/" element={<Navigate to="/church/home" replace />} />

      {/* Catch all route */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  ), [isAuthenticated, user]);

  return (
    <>
      <Toaster richColors position="top-right" />
      {renderRoutes()}
    </>
  );
};

export default App;

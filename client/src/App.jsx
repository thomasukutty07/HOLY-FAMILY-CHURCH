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

const App = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAuthCheck = useCallback(async () => {
    try {
      const data = await dispatch(checkAuth());
      if (data?.payload?.success && !isAuthenticated) {
        navigate("/admin/dashboard");
      } else if (!data?.payload?.success && isAuthenticated) {
        navigate("/auth/login");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      navigate("/auth/login");
    }
  }, [dispatch, navigate, isAuthenticated]);

  useEffect(() => {
    handleAuthCheck();
  }, [handleAuthCheck]);

  const renderRoutes = useCallback(() => (
    <Routes>
      {/* Public Church Routes */}
      <Route path="/church" element={<ChurchLayout />}>
        <Route index element={<HomeLayout />} />
        <Route path="home" element={<HomeLayout />} />
        <Route path="leaders" element={<Leaders />} />
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
      <Route
        path="/auth"
        element={
          !isAuthenticated ? (
            <LoginLayout />
          ) : (
            <Navigate to="/admin/dashboard" replace />
          )
        }
      >
        <Route index element={<Navigate to="/auth/login" replace />} />
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
      </Route>

      <Route path="/" element={<Navigate to="/church/home" replace />} />
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

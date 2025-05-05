import React, { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import HomeLayout from "./components/Layout/HomeLayout";
import ChurchLayout from "./components/Layout/ChurchLayout";
import Leaders from "./Pages/ClientView/Leaders";
import AdminLayout from "./components/Layout/AdminLayout";
import DashBoard from "./Pages/AdminView/DashBoard";
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
const App = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { familyNames, groupNames,groupData } = useSelector((state) => state.group);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(checkAuth()).then(
      (data) => {
        console.log(data);
        if (data?.payload?.success) {
          navigate("/admin/dashboard");
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }, [dispatch]);

  return (
    <>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route
          path="/church"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ChurchLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<HomeLayout />} />
          <Route path="leaders" element={<Leaders />} />
        </Route>

        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<DashBoard />} />
          <Route path="add-member" element={<AddMember />} />
          <Route path="create-family" element={<CreateFamily />} />
          <Route path="create-group" element={<CreateGroup />} />
          <Route path="members" element={<ShowAllMembers />} />
          <Route path="families" element={<ShowAllFamilies />} />
          <Route path="groups" element={<ShowAllGroups />} />
        </Route>
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <LoginLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<Login />} />
        </Route>
        <Route path="/" element={<Navigate to="/church/home" />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default App;

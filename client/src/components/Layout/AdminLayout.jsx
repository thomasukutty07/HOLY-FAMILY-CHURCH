import { Grid, Home, Menu, Shield, User, LogOut, Calendar } from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/Store/User/authSlice";
import { toast } from "sonner";

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const navigationItems = useMemo(() => [
    { id: 1, title: "Dashboard", path: "/admin/dashboard", icon: Shield },
    { id: 2, title: "Add Event", path: "/admin/calendar", icon: Calendar },
  ], []);

  const handleNavigation = useCallback((path) => {
    navigate(path);
    setIsOpen(false);
  }, [navigate]);

  const handleLogout = useCallback(async () => {
    try {
      const data = await dispatch(logoutUser());
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
        navigate("/auth/login");
      }
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
    }
  }, [dispatch, navigate]);

  const isActiveRoute = useCallback((path) => {
    return location.pathname === path;
  }, [location.pathname]);

  const renderNavigationItem = useCallback((item) => (
    <button
      key={item.id}
      className={`flex items-center gap-2 px-3 py-2 rounded-md w-full text-left ${
        isActiveRoute(item.path)
          ? "bg-indigo-100 text-indigo-700" 
          : "text-gray-700 hover:bg-gray-100"
      }`}
      onClick={() => handleNavigation(item.path)}
    >
      <item.icon className="h-5 w-5" />
      <span>{item.title}</span>
    </button>
  ), [handleNavigation, isActiveRoute]);

  const renderMobileHeader = useCallback(() => (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-10">
      <div className="flex items-center justify-between border-b px-4 py-3 bg-white">
        <div className="flex items-center gap-2">
          <button 
            className="p-1 rounded-md hover:bg-gray-100"
            onClick={() => setIsOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-600" />
            <span className="font-bold">Admin Panel</span>
          </div>
        </div>
        <button 
          className="flex items-center gap-1 px-2 py-1 text-sm rounded-md border border-red-200 text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  ), [handleLogout]);

  const renderMobileSidebar = useCallback(() => (
    isOpen && (
      <div className="lg:hidden fixed inset-0 z-20">
        <div 
          className="absolute inset-0"
          onClick={() => setIsOpen(false)}
        />
        <div className="absolute top-0 left-0 h-full w-64 bg-white shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-indigo-600" />
              <span className="font-bold text-xl">Admin Panel</span>
            </div>
            <button 
              className="p-1 rounded-md hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>
          <div className="p-4">
            {navigationItems.map(renderNavigationItem)}
          </div>
        </div>
      </div>
    )
  ), [isOpen, navigationItems, renderNavigationItem]);

  const renderDesktopSidebar = useCallback(() => (
    <div className="hidden lg:flex w-64 flex-col bg-white border-r shadow-sm">
      <div className="flex items-center gap-2 p-6 border-b">
        <Shield className="h-6 w-6 text-indigo-600" />
        <span className="font-bold text-xl">Admin Panel</span>
      </div>
      
      <div className="flex flex-col flex-1 p-4 space-y-1">
        {navigationItems.map(renderNavigationItem)}
      </div>
      
      <div className="p-4 border-t">
        <button 
          className="flex items-center gap-2 px-3 py-2 rounded-md w-full text-left text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  ), [navigationItems, renderNavigationItem, handleLogout]);

  return (
    <div className="flex h-screen bg-gray-50">
      {renderDesktopSidebar()}
      {renderMobileHeader()}
      {renderMobileSidebar()}

      <div className="flex-1 overflow-auto pt-16 lg:pt-0 bg-white">
        <div className="">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
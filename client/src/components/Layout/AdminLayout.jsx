import { Grid, Home, Menu, Shield, User, LogOut } from "lucide-react";
import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/Store/User/authSlice";
import { toast } from "sonner";

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navigationItems = [
    { id: 1, title: "Dashboard", path: "/admin/dashboard", icon: Shield },
    { id: 2, title: "Create Group", path: "/admin/create-group", icon: Grid },
    { id: 3, title: "Create Family", path: "/admin/create-family", icon: Home },
    { id: 4, title: "Add Member", path: "/admin/add-member", icon: User },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  function handleLogout() {
    dispatch(logoutUser()).then((data) => {
      console.log(data);
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
      }
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex w-64 flex-col bg-white border-r shadow-sm">
        <div className="flex items-center gap-2 p-6 border-b">
          <Shield className="h-6 w-6 text-indigo-600" />
          <span className="font-bold text-xl">Admin Panel</span>
        </div>
        
        <div className="flex flex-col flex-1 p-4 space-y-1">
          {navigationItems.map((item) => (
            <button
              key={item.id}
                              className={`flex items-center gap-2 px-3 py-2 rounded-md w-full text-left ${
                window.location.pathname === item.path 
                  ? "bg-indigo-100 text-indigo-700" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => handleNavigation(item.path)}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </button>
          ))}
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

      {/* Mobile Header & Sidebar */}
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

      {/* Mobile sidebar */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-20">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
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
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md w-full text-left mb-1 ${
                    window.location.pathname === item.path 
                      ? "bg-indigo-100 text-indigo-700" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto pt-16 lg:pt-0">
        <div className="p-6">
          {/* This is where the child route components will render */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
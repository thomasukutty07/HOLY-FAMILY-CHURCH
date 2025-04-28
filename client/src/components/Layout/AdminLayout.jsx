import { Group, House, ShieldUser, User } from "lucide-react";
import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/Store/User/authSlice";
import { toast } from "sonner";

const buttonControls = [
  { id: 1, title: "Dashboard", path: "/admin/dashboard", icon: ShieldUser },
  { id: 2, title: "Group", path: "/admin/create-group", icon: Group },
  { id: 3, title: "Family", path: "/admin/create-family", icon: House },
  { id: 4, title: "User", path: "/admin/add-user", icon: User },
];

function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/*  Sidebar for large screens */}
      <div className="border-r h-full sm:block hidden sm:h-screen pt-10 px-4 w-full sm:w-[250px]">
        <div className="flex items-center gap-2">
          <ShieldUser size={40} />
          <Link to={"/admin/dashboard"} className="font-europa text-3xl">
            Admin Panel
          </Link>
        </div>
        <div className="flex flex-col items-start gap-4 mt-6">
          {buttonControls.map((item) => (
            <Button
              variant="ghost"
              className="text-[20px] font-compacta justify-start gap-2 w-full"
              onClick={() => navigate(item.path)}
              key={item.id}
            >
              <item.icon className="w-5 h-5" /> {item.title}
            </Button>
          ))}
        </div>
      </div>

      {/*  Sidebar drawer for small screens */}
      <div className="block sm:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button className="m-4">Menu</Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle className="flex text-2xl font-benzin gap-2 items-center">
                <ShieldUser size={40} /> Admin Panel
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col items-start gap-4 ">
              {buttonControls.map((item) => (
                <Button
                  variant="ghost"
                  className="text-[20px] font-compacta justify-start gap-2 w-full"
                  onClick={() => {
                    navigate(item.path);
                    setIsOpen(false);
                  }}
                  key={item.id}
                >
                  <item.icon className="w-5 h-5" /> {item.title}
                </Button>
              ))}
              <Button className="ml-2">Logout</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

const AdminLayout = () => {
  const dispatch = useDispatch();
  function handleLogout() {
    dispatch(logoutUser()).then((data) => {
      console.log(data);
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
      }
    });
  }
  return (
    <div className="flex flex-col sm:flex-row min-h-screen ">
      {/* Sidebar */}
      <div className="sm:w-[250px] w-full">
        <SideBar />
      </div>

      {/* Right side (Header + Content) */}
      <div className="flex-1 flex flex-col">
        {/*  Logout always top-right */}
        <div className="sm:flex hidden bg-white sm:justify-end p-4 border-b w-full sticky top-0 z-10">
          <Button onClick={handleLogout}>Logout</Button>
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

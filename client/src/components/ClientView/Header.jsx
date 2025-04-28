import { headerItems } from "@/config";
import React, { useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import { MenuIcon } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";

const ClientHeader = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleNavigate(sectionId) {
    if (sectionId === "/") {
      navigate("/church/home");
    } else {
      navigate("/church/home", { state: { scrollTo: sectionId } });
    }
    setOpen(false);
  }
  return (
    <header className=" bg-transparent md:bg-white  px-6 md:px-10 py-6 md:py-8 mb-10 mx-4  xl:mx-22 sm:rounded-[40px] flex items-center sm:justify-center justify-start">
      {/* Left-side drawer menu (mobile) */}
      <div className="md:hidden">
        <Drawer open={open} onOpenChange={setOpen} direction="left">
          <DrawerTrigger asChild>
            <Button className="cursor-pointer" variant="outline" size="icon">
              <MenuIcon className="h-6 w-6 " />
            </Button>
          </DrawerTrigger>
          <DrawerContent
            className="bg-white p-6"
          >
            <h2 className="text-xl font-benzin mb-4 text-center">Menu</h2>
            <ul className="flex flex-col gap-4">
              {headerItems.map((item) => (
                <li
                  key={item.name}
                  className="font-compacta text-lg text-gray-700 hover:text-black transition"
                >
                  <ScrollLink
                    onClick={() => handleNavigate(item.path)}
                    to={item.path}
                    smooth={true}
                    duration={100}
                    className="cursor-pointer block"
                  >
                    {item.name}
                  </ScrollLink>
                </li>
              ))}
            </ul>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Nav Items for Desktop */}
      <ul className="hidden md:flex items-center justify-between gap-6">
        {headerItems.map((item) => (
          <li
            key={item.name}
            className="font-compacta cursor-pointer text-xl md:text-2xl text-gray-600 hover:text-black transition duration-300"
          >
            {item.path === "/" ? (
              <Link to={item.path}> {item.name} </Link>
            ) : (
              <ScrollLink
                onClick={() => handleNavigate(item.path)}
                to={item.path}
                smooth={true}
                duration={100}
              >
                {item.name}
              </ScrollLink>
            )}
          </li>
        ))}
      </ul>
    </header>
  );
};

export default ClientHeader;

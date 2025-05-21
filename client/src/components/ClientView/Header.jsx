import { getHeaderItems } from "@/config";
import React, { useState, useEffect } from "react";
import { Link as ScrollLink, scroller } from "react-scroll";
import { Menu, X, ChevronDown, Church, LogIn } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ClientHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerItems = getHeaderItems();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = (sectionId) => {
    if (sectionId === "/church/home") {
      if (location.pathname === "/church/home") {
        // Already on home, just scroll
        scroller.scrollTo("home", {
          duration: 1000,
          smooth: "easeInOutQuart",
          offset: -100,
        });
      } else {
        navigate("/church/home");
        setTimeout(() => {
          scroller.scrollTo("home", {
            duration: 1000,
            smooth: "easeInOutQuart",
            offset: -100,
          });
        }, 100);
      }
    } else if (sectionId === "about") {
      if (location.pathname === "/church/home") {
        scroller.scrollTo("about", {
          duration: 1000,
          smooth: "easeInOutQuart",
          offset: -100,
        });
      } else {
        navigate("/church/home", { state: { scrollTo: "about" } });
      }
    } else {
      navigate("/church/home", { state: { scrollTo: sectionId } });
    }
    setOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-gray-900/95 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <button
            onClick={() => handleNavigate("/church/home")}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Church className="w-6 h-6 text-white" />
            </div>
            <span className="font-compacta text-2xl bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Holy Family
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {headerItems.map((item) => (
              <div key={item.title} className="group relative">
                {item.path === "home" ? (
                  <button
                    onClick={() => handleNavigate(item.path)}
                    className="text-gray-300 hover:text-white transition-colors text-lg bg-transparent border-none outline-none cursor-pointer"
                  >
                    {item.title}
                  </button>
                ) : item.path === "events" ? (
                  <button
                    onClick={() => handleNavigate(item.path)}
                    className="text-gray-300 hover:text-white transition-colors text-lg bg-transparent border-none outline-none cursor-pointer"
                  >
                    {item.title}
                  </button>
                ) : (
                  <ScrollLink
                    onClick={() => handleNavigate(item.path)}
                    to={item.path}
                    spy={true}
                    smooth={true}
                    duration={300}
                    offset={item.offset}
                    className="text-gray-300 hover:text-white transition-colors text-lg cursor-pointer flex items-center gap-1"
                  >
                    {item.title}
                    <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                  </ScrollLink>
                )}
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
              </div>
            ))}
            <Button
              onClick={() => navigate("/auth/login")}
              className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Admin Login
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <button
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </button>
              </DrawerTrigger>
              <DrawerContent className="bg-gray-900 text-white">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-8">
                    <button
                      onClick={() => {
                        setOpen(false);
                        handleNavigate("/church/home");
                      }}
                      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Church className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-compacta text-2xl bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                        Holy Family
                      </span>
                    </button>
                    <button
                      className="text-gray-300 hover:text-white transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  <nav className="space-y-6">
                    {headerItems.map((item) => (
                      <div key={item.title} className="group">
                        {item.path === "home" ? (
                          <button
                            onClick={() => handleNavigate(item.path)}
                            className="block text-gray-300 hover:text-white transition-colors text-lg bg-transparent border-none outline-none cursor-pointer w-full text-left"
                          >
                            {item.title}
                          </button>
                        ) : item.path === "events" ? (
                          <button
                            onClick={() => handleNavigate(item.path)}
                            className="block text-gray-300 hover:text-white transition-colors text-lg bg-transparent border-none outline-none cursor-pointer w-full text-left"
                          >
                            {item.title}
                          </button>
                        ) : (
                          <ScrollLink
                            onClick={() => handleNavigate(item.path)}
                            to={item.path}
                            spy={true}
                            smooth={true}
                            duration={300}
                            offset={item.offset}
                            className="block text-gray-300 hover:text-white transition-colors text-lg cursor-pointer w-full text-left"
                          >
                            {item.title}
                          </ScrollLink>
                        )}
                        <div className="h-px w-0 bg-gradient-to-r from-indigo-400 to-purple-400 group-hover:w-full transition-all duration-300 mt-1"></div>
                      </div>
                    ))}
                    <Button
                      onClick={() => {
                        setOpen(false);
                        navigate("/auth/login");
                      }}
                      className="w-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Admin Login
                    </Button>
                  </nav>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ClientHeader;

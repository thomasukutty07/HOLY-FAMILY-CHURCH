import { headerItems } from "@/config";
import React, { useState, useEffect } from "react";
import { Link as ScrollLink, scroller } from "react-scroll";
import { Menu, X, ChevronDown } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";

const ClientHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
          duration: 300,
          smooth: "easeInOutQuart",
          offset: -100,
        });
      } else {
        navigate("/church/home");
        setTimeout(() => {
          scroller.scrollTo("home", {
            duration: 300,
            smooth: "easeInOutQuart",
            offset: -100,
          });
        }, 0);
      }
    } else {
      navigate("/church/home", { state: { scrollTo: sectionId } });
    }
    setOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-black/80 backdrop-blur-lg py-4" 
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavigate("/church/home")}
            className="text-2xl font-compacta text-white hover:text-indigo-400 transition-colors bg-transparent border-none outline-none cursor-pointer"
          >
            Holy Family
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {headerItems.map((item) => (
              <div key={item.name} className="relative group">
                {item.path === "/church/home" ? (
                  <button
                    onClick={() => handleNavigate(item.path)}
                    className="text-gray-300 hover:text-white transition-colors text-lg bg-transparent border-none outline-none cursor-pointer"
                  >
                    {item.name}
                  </button>
                ) : (
                  <ScrollLink
                    onClick={() => handleNavigate(item.path)}
                    to={item.path}
                    spy={true}
                    smooth={true}
                    duration={1000}
                    offset={-100}
                    className="text-gray-300 hover:text-white transition-colors text-lg cursor-pointer flex items-center gap-1"
                  >
                    {item.name}
                    <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                  </ScrollLink>
                )}
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-400 group-hover:w-full transition-all duration-300"></div>
              </div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Drawer open={open} onOpenChange={setOpen} direction="right">
              <DrawerTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-white hover:text-indigo-400 hover:bg-white/10"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-black/95 backdrop-blur-lg border-l border-white/10">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-xl font-compacta text-white">Menu</span>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setOpen(false)}
                      className="text-white hover:text-indigo-400 hover:bg-white/10"
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  </div>
                  
                  <nav className="space-y-6">
                    {headerItems.map((item) => (
                      <div key={item.name}>
                        {item.path === "/church/home" ? (
                          <button
                            onClick={() => handleNavigate(item.path)}
                            className="block text-gray-300 hover:text-white transition-colors text-lg bg-transparent border-none outline-none cursor-pointer"
                          >
                            {item.name}
                          </button>
                        ) : (
                          <ScrollLink
                            onClick={() => handleNavigate(item.path)}
                            to={item.path}
                            spy={true}
                            smooth={true}
                            duration={1000}
                            offset={-100}
                            className="block text-gray-300 hover:text-white transition-colors text-lg cursor-pointer"
                          >
                            {item.name}
                          </ScrollLink>
                        )}
                      </div>
                    ))}
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

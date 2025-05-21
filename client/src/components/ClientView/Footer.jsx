import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { scroller } from "react-scroll";
import { Church, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    if (path === "/church/home") {
      if (location.pathname === "/church/home") {
        scroller.scrollTo("home", {
          duration: 300,
          smooth: true,
          offset: -100,
        });
      } else {
        navigate("/church/home");
        scroller.scrollTo("home", {
          duration: 300,
          smooth: true,
          offset: -100,
        });
      }
    } else if (path === "birthdays") {
      if (location.pathname === "/church/home") {
        scroller.scrollTo("birthdays", {
          duration: 300,
          smooth: true,
          offset: -100,
        });
      } else {
        navigate("/church/home");
        scroller.scrollTo("birthdays", {
          duration: 300,
          smooth: true,
          offset: -100,
        });
      }
    } else {
      if (location.pathname === "/church/home") {
        scroller.scrollTo(path, {
          duration: 300,
          smooth: true,
          offset: -100,
        });
      } else {
        navigate("/church/home", { state: { scrollTo: path } });
      }
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Church Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Church className="w-6 h-6 text-white" />
              </div>
              <span className="font-compacta text-2xl bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Holy Family
              </span>
            </div>
            <p className="text-gray-400">
              A place of worship, community, and spiritual growth. Join us in our journey of faith,
              love, and service to God and our community.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavigate("/church/home")}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate("about")}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate("birthdays")}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Birthdays
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate("contact")}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-indigo-400 mt-1" />
                <span className="text-gray-400">
                  Kiliyarkandam<br />
                  Holy Family Church<br />
                  Idukki, Kerala 685604
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-indigo-400" />
                <span className="text-gray-400">(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-400" />
                <span className="text-gray-400">info@holyfamilychurch.org</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Holy Family Church. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
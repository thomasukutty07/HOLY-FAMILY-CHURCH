import React, { useEffect } from "react";
import { Element, scroller } from "react-scroll";
import ClientHome from "../ClientView/Home";
import History from "../ClientView/History";
import Birthdays from "../../Pages/ClientView/Birthdays";
import { useLocation } from "react-router-dom";

const HomeLayout = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        scroller.scrollTo(location.state.scrollTo, {
          duration: 1000,
          smooth: "easeInOutQuart",
          offset: -100,
        });
      }, 100);
    }
  }, [location.state]);

  return (
    <div className="relative">
      {/* Main Content Sections */}
      <Element name="home" className="relative">
        <div className="absolute inset-0 bg-[#0A0A0A]"></div>
        <ClientHome />
      </Element>
      
      <Element name="history" className="relative">
        <div className="absolute inset-0 bg-[#0A0A0A]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A] to-[#0A0A0A]"></div>
        <History />
      </Element>
      
      <Element name="birthdays" className="relative">
        <div className="absolute inset-0 bg-[#0A0A0A]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A] to-[#0A0A0A]"></div>
        <Birthdays />
      </Element>

      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.15),transparent_50%)]"></div>
      </div>
    </div>
  );
};

export default HomeLayout;

import React, { useState } from "react";
import { Outlet } from "react-router-dom";

const LoginLayout = () => {

  return (
    <div className="flex pl-40">
      <div className="flex items-center justify-center h-screen">
        <Outlet />
      </div>
      <div className="relative w-full flex items-center overflow-hidden">
        <div className="w-[900px] absolute h-[900px] -right-45 rounded-full from-[#4551df] to-[#11c0c3] bg-gradient-to-bl"></div>
      </div>
    </div>
  );
};

export default LoginLayout;

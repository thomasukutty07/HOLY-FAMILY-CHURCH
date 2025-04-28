import React from "react";
import ClientHeader from "../ClientView/Header";
import { Outlet } from "react-router-dom";

const ChurchLayout = () => {
  return (
    <div className="w-full bg-[#2b2b2b]  pt-10">
      <div className="flex justify-start md:justify-center items-center">
        <ClientHeader />
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default ChurchLayout;

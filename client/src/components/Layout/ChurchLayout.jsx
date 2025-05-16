import React from "react";
import ClientHeader from "../ClientView/Header";
import { Outlet } from "react-router-dom";

const ChurchLayout = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <ClientHeader />
      <main className="pt-24">
        <Outlet />
      </main>
    </div>
  );
};

export default ChurchLayout;

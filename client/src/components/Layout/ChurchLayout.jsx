import React from "react";
import ClientHeader from "../ClientView/Header";
import Footer from "../ClientView/Footer";
import { Outlet } from "react-router-dom";

const ChurchLayout = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <ClientHeader />
      <main className="pt-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default ChurchLayout;

// src/layouts/LandingLayout.jsx
import React from "react";
import LandingHeader from "@app/_components/Landing/LandingHeader/LandingHeader";
import LandingFooter from "@app/_components/Landing/LandingFooter/LandingFooter";
import { Outlet } from "react-router-dom";

const LandingLayout = () => {
  return (
    <div className=" flex flex-col min-h-screen w-full bg-white">
      <LandingHeader />
      <main className=" flex flex-col">
        <Outlet />
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingLayout;

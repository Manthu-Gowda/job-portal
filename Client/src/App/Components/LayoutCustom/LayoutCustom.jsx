import React from "react";
import { Outlet } from "react-router-dom";
import "./LayoutCustom.scss";

const LayoutCustom = () => {
  return (
    <div className="layout-custom">
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default LayoutCustom;

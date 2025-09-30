import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../Pages/Login/Login";
import LayoutCustom from "../Components/LayoutCustom/LayoutCustom";
import ProtectedRoute from "./ProtectedRoute";
import Maintenance from "../Pages/Maintenance/Maintenance";

const AppRoutes = () => (
  <Routes>
    <Route
      element={
        <ProtectedRoute>
          <LayoutCustom />
        </ProtectedRoute>
      }
    >
      {/* <Route path="/dashboard" element={<Dashboard />} /> */}
    </Route>
  </Routes>
);

const RouterComponent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/*" element={<AppRoutes />} />
        <Route path="/maintenance" element={<Maintenance />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterComponent;

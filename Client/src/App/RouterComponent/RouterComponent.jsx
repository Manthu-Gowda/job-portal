import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../Pages/Login/Login";
import SignUp from "../Pages/SignUp/SignUp";
import LayoutCustom from "../Components/LayoutCustom/LayoutCustom";
import ProtectedRoute from "./ProtectedRoute";
import Maintenance from "../Pages/Maintenance/Maintenance";
import Dashboard from "../Pages/Dashboard/Dashboard";
import JobSearch from "../Pages/JobSearch/JobSearch";
import JobSeekerProfile from "../Pages/Profile/JobSeekerProfile";

const AppRoutes = () => (
  <Routes>
    <Route
      element={
        <ProtectedRoute>
          <LayoutCustom />
        </ProtectedRoute>
      }
    >
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/jobs/search" element={<JobSearch />} />
      <Route path="/profile" element={<JobSeekerProfile />} />
      <Route path="/applications" element={<div>Applications Page - Coming Soon</div>} />
    </Route>
  </Routes>
);

const RouterComponent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/*" element={<AppRoutes />} />
        <Route path="/maintenance" element={<Maintenance />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterComponent;

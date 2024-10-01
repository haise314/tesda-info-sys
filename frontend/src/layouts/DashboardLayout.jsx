import React from "react";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import TopBar from "../components/dashboard/Topbar";
import Sidebar from "../components/dashboard/Sidebar";

const DashboardLayout = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <TopBar />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet /> {/* Renders the child routes */}
      </Box>
    </Box>
  );
};

export default DashboardLayout;

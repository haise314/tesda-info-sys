import React from "react";
import { Box, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import TopBar from "../components/dashboard/Topbar";
import Sidebar from "../components/dashboard/Sidebar";

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <CssBaseline />
      {/* TopBar stays fixed */}
      <TopBar onDrawerToggle={handleDrawerToggle} />

      {/* Sidebar with toggling on mobile */}
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />

        {/* Main content area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            mt: { xs: 0, sm: "64px" }, // No margin on mobile, margin for larger screens
            overflowY: "auto", // Allow scrolling if content is too long
            width: { sm: `calc(100% - 240px)` }, // Adjust for sidebar width on larger screens
            height: "100%", // Ensure it uses available height
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;

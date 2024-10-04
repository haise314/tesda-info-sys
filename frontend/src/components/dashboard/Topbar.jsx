import React from "react";
import { useAuth } from "../../context/AuthContext"; // Import AuthContext to access the user and logout
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Box,
  Stack,
  Badge,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const TopBar = () => {
  const { user, logout } = useAuth(); // Get user info and logout function
  const [anchorEl, setAnchorEl] = React.useState(null); // State for menu anchor

  // Handle opening and closing of the user menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Function to handle logout
  const handleLogout = () => {
    logout(); // Call logout from AuthContext
  };

  // Determine the dashboard title based on user role
  const dashboardTitle =
    user?.role === "admin" || user?.role === "superadmin"
      ? "Admin Dashboard"
      : "Client Dashboard";

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: "#0038a8" }}
    >
      <Toolbar>
        {/* Logo */}
        <img src="../tesda_icon.svg" alt="Tesda Logo" width="40px" />

        {/* Dynamically change dashboard title based on role */}
        <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
          {dashboardTitle}
        </Typography>

        {/* Right-side actions: Notifications, User Avatar */}
        <Stack direction="row" spacing={2}>
          {/* Notifications (placeholder) */}
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* User Avatar with Menu */}
          <Tooltip title="Account settings">
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: "secondary.main" }}>
                {user?.name?.charAt(0) || user?.role?.charAt(0) || "A"}
              </Avatar>
            </IconButton>
          </Tooltip>

          {/* Menu that appears when avatar is clicked */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleMenuClose}>
              <AccountCircleIcon sx={{ mr: 1 }} /> Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;

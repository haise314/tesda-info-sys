import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Badge,
  useTheme,
  Stack,
  Avatar,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import tesdaIcon from "../../assets/tesda_icon.png";
import ProfileImage from "./ProfileImage";

const TopBar = ({ onDrawerToggle }) => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const getDashboardTitle = () => {
    if (user?.role?.includes("superadmin")) return "Admin Dashboard";
    if (user?.role?.includes("admin")) return "Employee Dashboard";
    return "Client Dashboard";
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: "#0038a8",
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onDrawerToggle}
          sx={{
            mr: 2,
            display: { sm: "none" },
            zIndex: (theme) => theme.zIndex.drawer + 2,
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box
          component="img"
          src={tesdaIcon}
          alt="Tesda Logo"
          sx={{
            width: 40,
            height: 40,
            mr: 2,
          }}
        />

        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {getDashboardTitle()}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton
            onClick={handleMenu}
            color="inherit"
            sx={{
              ml: 1,
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <Avatar
              sx={{
                bgcolor: theme.palette.secondary.main,
                width: 32,
                height: 32,
              }}
            >
              {user?.name?.charAt(0) || user?.role?.charAt(0) || "A"}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleClose}>
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

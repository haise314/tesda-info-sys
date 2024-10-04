// Sidebar.jsx
import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PeopleIcon from "@mui/icons-material/People";
import FeedIcon from "@mui/icons-material/Feed";
import Quiz from "@mui/icons-material/Quiz";
import FeedbackIcon from "@mui/icons-material/Feedback";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../context/AuthContext"; // Import useAuth hook

const drawerWidth = 240;

const Sidebar = () => {
  const { user } = useAuth(); // Get user from AuthContext
  const role = user?.role || "client"; // Default to client if role is not available

  const menuItems = [
    {
      title: "Profile",
      path: "profile",
      icon: <AccountBoxIcon />,
      roles: ["client", "admin", "superadmin"],
    },
    {
      title: "Clients",
      path: "clients",
      icon: <PeopleIcon />,
      roles: ["admin", "superadmin"],
    },
    {
      title: "Applicants",
      path: "applicants",
      icon: <PeopleIcon />,
      roles: ["admin", "superadmin"],
    },
    {
      title: "Create Training Programs",
      path: "programs",
      icon: <FeedIcon />,
      roles: ["admin", "superadmin"],
    },
    {
      title: "Training Programs",
      path: "training-programs",
      icon: <FeedIcon />,
      roles: ["client", "admin", "superadmin"],
    },
    {
      title: "MATB",
      path: "MATB",
      icon: <Quiz />,
      roles: ["admin", "superadmin"],
    },
    {
      title: "Feedback",
      path: "feedback",
      icon: <FeedbackIcon />,
      roles: ["admin", "superadmin"],
    },
    {
      title: "Notifications",
      path: "notifications",
      icon: <NotificationsIcon />,
      roles: ["client", "admin", "superadmin"],
    },
    {
      title: "Scheduling",
      path: "scheduling",
      icon: <CalendarMonthIcon />,
      roles: ["admin", "superadmin"],
    },
    {
      title: "Reports",
      path: "reports",
      icon: <AssessmentIcon />,
      roles: ["admin", "superadmin"],
    },
    {
      title: "Settings",
      path: "settings",
      icon: <SettingsIcon />,
      roles: ["admin", "superadmin"],
    },
    {
      title: "Logout",
      path: "../",
      icon: <LogoutIcon />,
      roles: ["client", "admin", "superadmin"],
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <List>
        {menuItems
          .filter((item) => item.roles.includes(role)) // Filter menu items by user role
          .map(({ title, path, icon }) => (
            <ListItem key={title} disablePadding>
              <ListItemButton component={NavLink} to={`/dashboard/${path}`}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={title} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;

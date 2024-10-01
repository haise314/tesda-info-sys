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

const drawerWidth = 240;

const Sidebar = () => {
  const menuItems = [
    { title: "Profile", path: "profile", icon: <AccountBoxIcon /> },
    { title: "Clients", path: "clients", icon: <PeopleIcon /> },
    {
      title: "Applicants",
      path: "applicants",
      icon: <PeopleIcon />,
    },
    {
      title: "Training Programs",
      path: "programs",
      icon: <FeedIcon />,
    },
    {
      title: "MATB",
      path: "MATB",
      icon: <Quiz />,
    },
    {
      title: "Feedback",
      path: "feedback",
      icon: <FeedbackIcon />,
    },
    {
      title: "Notifications",
      path: "notifications",
      icon: <NotificationsIcon />,
    },
    {
      title: "Scheduling",
      path: "scheduling",
      icon: <CalendarMonthIcon />,
    },
    {
      title: "Reports",
      path: "reports",
      icon: <AssessmentIcon />,
    },
    {
      title: "Settings",
      path: "settings",
      icon: <SettingsIcon />,
    },
    {
      title: "Logout",
      path: "../",
      icon: <LogoutIcon />,
    },
    // Add more items as needed
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
        {menuItems.map(({ title, path, icon }) => (
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

import React from "react";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Toolbar,
  IconButton,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  AccountBox as AccountBoxIcon,
  People as PeopleIcon,
  Feed as FeedIcon,
  Quiz,
  Feedback as FeedbackIcon,
  Notifications as NotificationsIcon,
  CalendarMonth as CalendarMonthIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

const drawerWidth = 240;

const Sidebar = ({ mobileOpen, onDrawerToggle }) => {
  const { user } = useAuth();
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  const role = user?.role || "client";

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
      title: "Training Program Table",
      path: "training-program-table",
      icon: <FeedIcon />,
      roles: ["admin", "superadmin"],
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

  const drawer = (
    <Box>
      <Toolbar /> {/* This creates space for the AppBar */}
      <List>
        {menuItems
          .filter((item) => item.roles.includes(role))
          .map(({ title, path, icon }) => (
            <ListItem key={title} disablePadding>
              <ListItemButton
                component={NavLink}
                to={`/dashboard/${path}`}
                onClick={!isSmUp ? onDrawerToggle : undefined}
                sx={{
                  minHeight: 48,
                  "&.active": {
                    bgcolor: "action.selected",
                    "& .MuiListItemIcon-root": {
                      color: "primary.main",
                    },
                    "& .MuiListItemText-primary": {
                      color: "primary.main",
                      fontWeight: 600,
                    },
                  },
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: "text.secondary",
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={title}
                  sx={{
                    "& .MuiTypography-root": {
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { sm: drawerWidth },
        flexShrink: { sm: 0 },
      }}
      aria-label="dashboard navigation"
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            bgcolor: "background.default",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            bgcolor: "background.default",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;

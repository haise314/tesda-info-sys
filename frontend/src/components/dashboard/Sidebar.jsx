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
} from "@mui/icons-material";

const drawerWidth = 240;

const Sidebar = ({ mobileOpen, onDrawerToggle }) => {
  const { user, logout } = useAuth();
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
      title: "Users",
      path: "users",
      icon: <PeopleIcon />,
      roles: ["superadmin"],
    },
    {
      title: "Registrants",
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
      title: "Deleted Applicants",
      path: "deleted-applicants",
      icon: <PeopleIcon />,
      roles: ["superadmin"],
    },
    {
      title: "Deleted Registrants",
      path: "deleted-registrants",
      icon: <PeopleIcon />,
      roles: ["superadmin"],
    },
    {
      title: "Create Training Programs",
      path: "programs",
      icon: <FeedIcon />,
      roles: ["superadmin"],
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
      roles: ["superadmin"],
    },
    {
      title: "MATB Create Test",
      path: "MATB",
      icon: <Quiz />,
      roles: ["admin", "superadmin"],
    },
    {
      title: "MATB Tests",
      path: "MATB-list",
      icon: <Quiz />,
      roles: ["admin", "superadmin"],
    },
    {
      title: "MATB Management",
      path: "MATB-management",
      icon: <Quiz />,
      roles: ["admin", "superadmin"],
    },
    {
      title: "MATB Results",
      path: "MATB-results",
      icon: <Quiz />,
      roles: ["admin", "superadmin"],
    },
    {
      title: "MATB Results ",
      path: "MATB-results-client",
      icon: <Quiz />,
      roles: ["client"],
    },
    {
      title: "Feedback",
      path: "feedback",
      icon: <FeedbackIcon />,
      roles: ["admin", "superadmin"],
    },
    // {
    //   title: "Notifications",
    //   path: "notifications",
    //   icon: <NotificationsIcon />,
    //   roles: ["client", "admin", "superadmin"],
    // },
    {
      title: "Scheduling",
      path: "scheduling",
      icon: <CalendarMonthIcon />,
      roles: ["admin", "superadmin"],
    },
    {
      title: "Event Calendar",
      path: "event-calendar",
      icon: <CalendarMonthIcon />,
      roles: ["admin", "superadmin"],
    },
    {
      title: "Schedules",
      path: "event-calendar-client",
      icon: <CalendarMonthIcon />,
      roles: ["client"],
    },
    // {
    //   title: "Reports",
    //   path: "reports",
    //   icon: <AssessmentIcon />,
    //   roles: ["admin", "superadmin"],
    // },
    {
      title: "News and Updates",
      path: "news-list",
      icon: <FeedIcon />,
      roles: ["client"],
    },
    {
      title: "News Create",
      path: "news-create",
      icon: <FeedIcon />,
      roles: ["admin", "superadmin"],
    },
    // {
    //   title: "Settings",
    //   path: "settings",
    //   icon: <SettingsIcon />,
    //   roles: ["admin", "superadmin"],
    // },
    {
      title: "Logout",
      icon: <LogoutIcon />,
      roles: ["client", "admin", "superadmin"],
      onClick: logout,
    },
  ];

  const drawer = (
    <Box>
      <Toolbar />
      <List>
        {menuItems
          .filter((item) => item.roles.includes(role))
          .map(({ title, path, icon, onClick }) => (
            <ListItem key={title} disablePadding>
              <ListItemButton
                component={onClick ? "button" : NavLink}
                to={onClick ? undefined : `/dashboard/${path}`}
                onClick={(event) => {
                  if (onClick) {
                    onClick();
                  }
                  if (!isSmUp) {
                    onDrawerToggle();
                  }
                }}
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

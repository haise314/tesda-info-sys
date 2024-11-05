import React, { useState } from "react";
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
  Collapse,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  AccountBox as AccountBoxIcon,
  People as PeopleIcon,
  Feed as FeedIcon,
  Quiz,
  Feedback as FeedbackIcon,
  CalendarMonth as CalendarMonthIcon,
  Logout as LogoutIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";

const drawerWidth = 240;

const Sidebar = ({ mobileOpen, onDrawerToggle }) => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  const role = user?.role || "client";

  const [openAccordions, setOpenAccordions] = useState({});

  const toggleAccordion = (title) => {
    setOpenAccordions((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const menuItems = [
    {
      title: "Profile",
      path: "profile",
      icon: <AccountBoxIcon />,
      roles: ["client", "admin", "superadmin"],
    },
    {
      title: "Enrollment",
      icon: <PeopleIcon />,
      roles: ["client"],
      children: [
        {
          title: "Course/Qualification Registration",
          path: "client-registration",
          roles: ["client"],
        },
        {
          title: "Assessment Application",
          path: "client-application",
          roles: ["client"],
        },
      ],
    },
    {
      title: "Clients",
      icon: <PeopleIcon />,
      roles: ["admin", "superadmin"],
      children: [
        { title: "Users", path: "users", roles: ["superadmin"] },
        {
          title: "Course/Qualifications",
          path: "clients",
          roles: ["admin", "superadmin"],
        },
        {
          title: "Assessment Applications",
          path: "applicants",
          roles: ["admin", "superadmin"],
        },
      ],
    },
    {
      title: "Archive",
      icon: <PeopleIcon />,
      roles: ["superadmin"],
      children: [
        {
          title: "Archived Course Registrants",
          path: "deleted-registrants",
          roles: ["superadmin"],
        },
        {
          title: "Archived Assessment Applicants",
          path: "deleted-applicants",
          roles: ["superadmin"],
        },
      ],
    },
    {
      title: "Course/Qualifications",
      icon: <FeedIcon />,
      roles: ["client", "admin", "superadmin"],
      children: [
        {
          title: "Create Course/Qualification",
          path: "programs",
          roles: ["superadmin"],
        },
        {
          title: "Courses/Qualifications",
          path: "training-programs",
          roles: ["client", "admin", "superadmin"],
        },
        {
          title: "Course/Qualification Table",
          path: "training-program-table",
          roles: ["superadmin"],
        },
      ],
    },
    {
      title: "MATB Test",
      path: "MATB-client",
      icon: <Quiz />,
      roles: ["client"],
    },
    {
      title: "MATB",
      icon: <Quiz />,
      roles: ["admin", "superadmin"],
      children: [
        {
          title: "MATB Create Test",
          path: "MATB",
          roles: ["admin", "superadmin"],
        },
        {
          title: "MATB Test List",
          path: "MATB-list",
          roles: ["admin", "superadmin"],
        },
        {
          title: "MATB Sessions",
          path: "MATB-management",
          roles: ["admin", "superadmin"],
        },
        {
          title: "MATB Results",
          path: "MATB-results",
          roles: ["admin", "superadmin"],
        },
      ],
    },
    {
      title: "MATB Results",
      path: "MATB-results-client",
      icon: <Quiz />,
      roles: ["client"],
    },
    {
      title: "Feedback",
      icon: <FeedbackIcon />,
      roles: ["admin", "superadmin"],
      children: [
        {
          title: "Customer Feedback",
          path: "feedback",
          icon: <FeedbackIcon />,
          roles: ["admin", "superadmin"],
        },
        {
          title: "Citizens Charter",
          path: "citizens-charter",
          icon: <FeedbackIcon />,
          roles: ["admin", "superadmin"],
        },
      ],
    },
    {
      title: "Analytics",
      icon: <FeedIcon />,
      roles: ["admin", "superadmin"],
      children: [
        {
          title: "Client Analytics",
          path: "client-analytics",
          icon: <FeedIcon />,
          roles: ["admin", "superadmin"],
        },
        {
          title: "Feedback Analytics",
          path: "feedback-analytics",
          icon: <FeedbackIcon />,
          roles: ["admin", "superadmin"],
        },
      ],
    },
    {
      title: "System Management",
      icon: <FeedIcon />,
      roles: ["superadmin"],
      children: [
        // {
        //   title: "Context",
        //   path: "Context",
        //   icon: <FeedIcon />,
        //   roles: ["admin", "superadmin"],
        // },
        {
          title: "Assessments",
          path: "Assessments",
          icon: <FeedIcon />,
          roles: ["admin", "superadmin"],
        },
        {
          title: "Training Centers",
          path: "Training-Centers",
          icon: <FeedIcon />,
          roles: ["admin", "superadmin"],
        },
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
      ],
    },

    {
      title: "Logout",
      icon: <LogoutIcon />,
      roles: ["client", "admin", "superadmin"],
      onClick: logout,
    },
  ];

  const renderMenuItem = (item, depth = 0) => {
    if (item.children) {
      return (
        <React.Fragment key={item.title}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => toggleAccordion(item.title)}
              sx={{ pl: 2 * depth }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
              {openAccordions[item.title] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse
            in={openAccordions[item.title]}
            timeout="auto"
            unmountOnExit
          >
            <List component="div" disablePadding>
              {item.children
                .filter((child) => child.roles.includes(role))
                .map((child) => renderMenuItem(child, depth + 1))}
            </List>
          </Collapse>
        </React.Fragment>
      );
    } else {
      return (
        <ListItem key={item.title} disablePadding>
          <ListItemButton
            component={item.onClick ? "button" : NavLink}
            to={item.onClick ? undefined : `/dashboard/${item.path}`}
            onClick={(event) => {
              if (item.onClick) {
                item.onClick();
              }
              if (!isSmUp) {
                onDrawerToggle();
              }
            }}
            sx={{
              pl: 2 * depth,
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
            <ListItemIcon sx={{ minWidth: 40, color: "text.secondary" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.title}
              sx={{
                "& .MuiTypography-root": {
                  fontSize: "0.875rem",
                  fontWeight: 500,
                },
              }}
            />
          </ListItemButton>
        </ListItem>
      );
    }
  };

  const drawer = (
    <Box>
      <Toolbar />
      <List>
        {menuItems
          .filter((item) => item.roles.includes(role))
          .map((item) => renderMenuItem(item))}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="dashboard navigation"
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
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

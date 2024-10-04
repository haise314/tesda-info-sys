import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  Divider,
  Avatar,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import SchoolIcon from "@mui/icons-material/School";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LoginIcon from "@mui/icons-material/Login";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState } from "react";
import tesdaIcon from "../../assets/tesda_icon.png";

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuItems = [
    { title: "Training Program", path: "/programs", icon: <SchoolIcon /> },
    { title: "Register", path: "/register", icon: <PersonAddIcon /> },
    { title: "Application", path: "/apply", icon: <ReceiptIcon /> },
    { title: "MATB", path: "/MATB", icon: <ReceiptIcon /> },
    { title: "Login", path: "/login", icon: <LoginIcon /> },
  ];

  const DrawerHeader = () => (
    <Box
      sx={{
        p: 2,
        bgcolor: "#0038a8",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Avatar
          src={tesdaIcon}
          alt="Tesda Logo"
          sx={{
            width: 40,
            height: 40,
            mr: 2,
            bgcolor: "white",
            p: 0.5,
          }}
        />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          TESDA Menu
        </Typography>
      </Box>
      <IconButton onClick={toggleDrawer(false)} sx={{ color: "white" }}>
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );

  return (
    <AppBar position="static" sx={{ bgcolor: "#0038a8" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <img
              src={tesdaIcon}
              alt="Tesda Logo"
              style={{ width: 40, marginRight: theme.spacing(2) }}
            />
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                fontWeight: 700,
                letterSpacing: ".1rem",
                color: "inherit",
                textDecoration: "none",
                flexGrow: 1,
              }}
            >
              TESDA Information System
            </Typography>
          </Box>

          {isMobile ? (
            <>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>

              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                PaperProps={{
                  sx: {
                    width: 280,
                    bgcolor: "background.default",
                  },
                }}
              >
                <DrawerHeader />
                <Divider />
                <List sx={{ pt: 1 }}>
                  {menuItems.map((item, index) => (
                    <ListItem
                      button
                      component={Link}
                      to={item.path}
                      key={item.title}
                      sx={{
                        py: 1.5,
                        "&:hover": {
                          bgcolor: "action.hover",
                        },
                        "& .MuiListItemIcon-root": {
                          color: "primary.main",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 40,
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.title}
                        primaryTypographyProps={{
                          sx: {
                            fontWeight: 500,
                          },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: "flex", gap: 2 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.title}
                  component={Link}
                  to={item.path}
                  sx={{
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  {item.title}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;

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
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu"; // Use MenuIcon instead of GridMenuIcon
import SchoolIcon from "@mui/icons-material/School";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LoginIcon from "@mui/icons-material/Login";
import { useState } from "react";

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

  return (
    <AppBar position="static" sx={{ bgcolor: "#0038a8" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <img
              src="../tesda_icon.svg"
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
              >
                <Box
                  sx={{ width: 250, bgcolor: "#f5f5f5", color: "#000" }}
                  role="presentation"
                  onClick={toggleDrawer(false)}
                  onKeyDown={toggleDrawer(false)}
                >
                  <List>
                    {menuItems.map((item) => (
                      <ListItem
                        button
                        component={Link}
                        to={item.path}
                        key={item.title}
                      >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.title} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
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

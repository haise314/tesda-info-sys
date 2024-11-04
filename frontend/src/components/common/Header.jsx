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
  useTheme,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import SchoolIcon from "@mui/icons-material/School";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LoginIcon from "@mui/icons-material/Login";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import tesdaIcon from "../../assets/tesda_icon.png";

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const menuItems = [
    { title: "Course/Qualifications", path: "/programs", icon: <SchoolIcon /> },
    // { title: "Register", path: "/register", icon: <PersonAddIcon /> },
    // { title: "Application", path: "/apply", icon: <ReceiptIcon /> },
    // { title: "MATB", path: "/MATB", icon: <ReceiptIcon /> },
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
      <IconButton
        onClick={() => setDrawerOpen(false)}
        sx={{
          color: "white",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: "#0038a8",
        boxShadow: 3,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 56, sm: 64 },
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isMobile && (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => setDrawerOpen(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Box
              component={Link}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <img
                src={tesdaIcon}
                alt="Tesda Logo"
                style={{
                  width: isMobile ? 32 : 40,
                  height: "auto",
                  marginRight: theme.spacing(1),
                }}
              />
              <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                sx={{
                  fontWeight: 700,
                  letterSpacing: ".05rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                TESDA Information System
              </Typography>
            </Box>
          </Box>

          {!isMobile && (
            <Box sx={{ display: "flex", gap: 1 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.title}
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    color: "white",
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    textTransform: "none",
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

          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{
              sx: {
                width: "280px",
                maxWidth: "80%",
              },
            }}
          >
            <DrawerHeader />
            <Divider />
            <List sx={{ pt: 1 }}>
              {menuItems.map((item) => (
                <ListItem
                  button
                  key={item.title}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    py: 1.5,
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: "primary.main",
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
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;

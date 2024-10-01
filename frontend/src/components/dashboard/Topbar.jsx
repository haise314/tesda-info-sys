// TopBar.jsx
import React from "react";
import { AppBar, Stack, Toolbar, Typography } from "@mui/material";

const TopBar = () => {
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: "#0038a8" }}
    >
      <Toolbar>
        <img src="../tesda_icon.svg" alt="Tesda Logo" width={"40px"} />
        <Toolbar>
          <Typography variant="h6">Admin Dashboard</Typography>
        </Toolbar>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;

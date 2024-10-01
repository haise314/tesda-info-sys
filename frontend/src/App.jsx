import React from "react";
import Header from "./components/common/Header";
import { Outlet } from "react-router-dom";
import Footer from "./components/common/Footer";
import { Box } from "@mui/material";

const App = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        margin: 0,
        padding: 0,
      }}
    >
      <Header />
      <Outlet />
      <Footer />
    </Box>
  );
};

export default App;

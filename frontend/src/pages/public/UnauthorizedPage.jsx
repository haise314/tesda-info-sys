// src/components/Unauthorized.jsx
import React from "react";
import { Typography, Container, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 4, flexGrow: 1, height: "100vh" }}>
      <Typography variant="h4" gutterBottom>
        Unauthorized Access
      </Typography>
      <Typography variant="body1" paragraph>
        You don't have permission to access this page.
      </Typography>
      <Button component={Link} to="/login" variant="contained" color="primary">
        Go to Login
      </Button>
    </Container>
  );
};

export default Unauthorized;

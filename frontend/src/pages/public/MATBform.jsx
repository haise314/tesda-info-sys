import React, { useState } from "react";
import TestAnswerSheet from "./TestAnswerSheet";
import { Box, Container, Paper, Typography } from "@mui/material";
import LoginMATB from "./LoginMATB";
import { useAuth } from "../../context/AuthContext";

const MATBform = () => {
  const [userUli, setUserUli] = useState(null);
  const { login } = useAuth();

  const handleLoginSuccess = (userData) => {
    console.log("Login success, userData:", userData);
    if (userData && userData.uli) {
      login(userData);
      setUserUli(userData.uli);
    } else {
      console.error("Invalid userData received:", userData);
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        py: 4, // Add some padding to top and bottom
      }}
    >
      <Paper elevation={3} sx={{ overflow: "hidden" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 3,
            maxHeight: "80vh", // Limit the height
            overflowY: "auto", // Allow vertical scrolling
          }}
        >
          {userUli ? (
            <TestAnswerSheet uli={userUli} />
          ) : (
            <>
              <Typography variant="h4" gutterBottom>
                Login to Access Test
              </Typography>
              <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
                Please enter your ULI and password
              </Typography>
              <LoginMATB onLoginSuccess={handleLoginSuccess} />
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default MATBform;

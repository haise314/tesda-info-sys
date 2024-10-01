import React, { useState } from "react";
import TestAnswerSheet from "./TestAnswerSheet";
import { Box, Container, Typography } from "@mui/material";
import LoginMATB from "./LoginMATB";

const MATBform = () => {
  const [registrantId, setRegistrantId] = useState(null);

  const handleLoginSuccess = (id) => {
    setRegistrantId(id);
  };

  return (
    <Container sx={{ height: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        {registrantId ? (
          <TestAnswerSheet registrantId={registrantId} />
        ) : (
          <>
            <Typography variant="h4" gutterBottom>
              Login to Access Test
            </Typography>
            <Typography variant="body1" gutterBottom>
              (Registrants)
            </Typography>
            <LoginMATB onLoginSuccess={handleLoginSuccess} />
          </>
        )}
      </Box>
    </Container>
  );
};

export default MATBform;

import React from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";

const RegistrantDetails = ({ data, handlePrintPDF, isPrinting }) => {
  if (!data) {
    return <Typography>No registrant details available.</Typography>;
  }

  console.log("RegistrantDetails data:", data);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Registrant Details
      </Typography>
      <Typography>
        Full Name:{" "}
        {`${data.name?.firstName || ""} ${data.name?.middleName || ""} ${
          data.name?.lastName || ""
        }`}
      </Typography>
      <Typography>
        Address:{" "}
        {`${data.completeMailingAddress?.street || ""}, ${
          data.completeMailingAddress?.barangay || ""
        }, ${data.completeMailingAddress?.city || ""}`}
      </Typography>
      <Typography>Contact Email: {data.contact?.email || ""}</Typography>
      <Button
        onClick={handlePrintPDF}
        disabled={isPrinting}
        variant="contained"
        sx={{ mt: 2 }}
      >
        {isPrinting ? <CircularProgress size={24} /> : "Print Registrant Form"}
      </Button>
    </Box>
  );
};

export default RegistrantDetails;

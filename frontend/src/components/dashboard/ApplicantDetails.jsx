import React from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";

const ApplicantDetails = ({ data, handlePrintPDF, isPrinting }) => {
  if (!data) {
    return <Typography>No applicant details available.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Applicant Details
      </Typography>
      <Typography>
        Full Name:
        {`${data.data?.name?.firstName} ${data.data?.name?.middleName || ""} ${
          data.data?.name?.lastName
        }`}
      </Typography>
      <Typography>
        Address:{" "}
        {`${data.data?.completeMailingAddress?.street || ""}, ${
          data.data?.completeMailingAddress?.barangay || ""
        }, ${data.data?.completeMailingAddress?.city || ""}`}
      </Typography>
      <Typography>Training Center: {data.data?.trainingCenterName}</Typography>
      <Typography>Assessment Title: {data.data?.assessmentTitle}</Typography>
      <Typography>
        Application Status: {data.data?.applicationStatus}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={handlePrintPDF}
        disabled={isPrinting}
      >
        {isPrinting ? <CircularProgress size={24} /> : "Print Applicant Form"}
      </Button>
    </Box>
  );
};

export default ApplicantDetails;

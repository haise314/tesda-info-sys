import React from "react";
import { Box, Typography, Grid, Button, Divider } from "@mui/material";

const PersonalInformation = ({ userData, onGeneratePDF }) => {
  if (!userData) {
    return <Typography>No personal information available</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Personal Information
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1">Full Name</Typography>
          <Typography>
            {userData.name?.firstName} {userData.name?.middleName}{" "}
            {userData.name?.lastName} {userData.name?.extension}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1">Birth Details</Typography>
          <Typography>
            Born on {new Date(userData.birthdate).toLocaleDateString()}
            in {userData.birthplace?.city}, {userData.birthplace?.province}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1">Contact Information</Typography>
          <Typography>Email: {userData.contact?.email}</Typography>
          <Typography>Mobile: {userData.contact?.mobileNumber}</Typography>
          <Typography>
            Telephone: {userData.contact?.telephoneNumber}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1">Address</Typography>
          <Typography>
            {userData.completeMailingAddress?.street},
            {userData.completeMailingAddress?.barangay},
            {userData.completeMailingAddress?.city},
            {userData.completeMailingAddress?.province}
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" color="primary" onClick={onGeneratePDF}>
          Generate Personal Info PDF
        </Button>
      </Box>
    </Box>
  );
};

export default PersonalInformation;

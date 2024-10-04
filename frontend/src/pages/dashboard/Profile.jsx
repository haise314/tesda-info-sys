import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Avatar,
  Grid,
  Paper,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user && user.uli) {
        try {
          const [registrantRes, applicantRes] = await Promise.all([
            axios.get("/api/register"),
            axios.get("/api/applicants"),
          ]);

          const registrant = registrantRes.data.data.find(
            (r) => r.uli === user.uli
          );
          const applicant = applicantRes.data.data.find(
            (a) => a.uli === user.uli
          );

          setProfileData({
            ...user,
            registrantData: registrant,
            applicantData: applicant,
          });
        } catch (error) {
          console.error("Error fetching profile data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfileData();
  }, [user]);

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ padding: 4 }}>
      <Grid container justifyContent="center">
        <Avatar
          sx={{
            width: 120,
            height: 120,
            marginBottom: 2,
          }}
        />
      </Grid>
      <Typography variant="h4" align="center">
        {profileData?.uli || "User Name"}
      </Typography>
      <Paper
        sx={{
          padding: 3,
          marginTop: 3,
          maxWidth: 600,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Typography variant="h6">User Details</Typography>
        <Typography variant="body1">ULI: {profileData?.uli}</Typography>
        <Typography variant="body1">Role: {profileData?.role}</Typography>

        {profileData?.registrantData && (
          <Box mt={2}>
            <Typography variant="h6">Registrant Data</Typography>
            <Typography variant="body1">
              Name:{" "}
              {`${profileData.registrantData.name.firstName} ${profileData.registrantData.name.lastName}`}
            </Typography>
            {/* Add more registrant details as needed */}
          </Box>
        )}

        {profileData?.applicantData && (
          <Box mt={2}>
            <Typography variant="h6">Applicant Data</Typography>
            <Typography variant="body1">
              Training: {profileData.applicantData.training}
            </Typography>
            {/* Add more applicant details as needed */}
          </Box>
        )}

        <Box display="flex" justifyContent="flex-end">
          <Button variant="contained" color="primary" sx={{ marginTop: 2 }}>
            Edit Profile
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;

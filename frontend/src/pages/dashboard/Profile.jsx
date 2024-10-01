import React from "react";
import {
  Container,
  Typography,
  Avatar,
  Grid,
  Paper,
  Button,
  Box,
} from "@mui/material";

const Profile = () => {
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
        User Name
      </Typography>
      <Paper
        sx={{
          padding: 3,
          marginTop: 3,
          // Optional: adjust width to fit better in the layout
          maxWidth: 600,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Typography variant="body1">User details go here.</Typography>
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

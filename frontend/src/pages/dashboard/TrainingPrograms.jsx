import React, { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Grid,
} from "@mui/material";

const TrainingPrograms = () => {
  // State to store form data
  const [formData, setFormData] = useState({
    title: "",
    duration: "",
    trainer: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add functionality to save or send data to backend
    console.log("Training Program Data: ", formData);
  };

  return (
    <Container sx={{ flexGrow: 1, mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Create Training Program
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="title"
                name="title"
                label="Program Title"
                variant="outlined"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="duration"
                name="duration"
                label="Program Duration"
                variant="outlined"
                value={formData.duration}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="trainer"
                name="trainer"
                label="Trainer Name"
                variant="outlined"
                value={formData.trainer}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Create Program
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default TrainingPrograms;

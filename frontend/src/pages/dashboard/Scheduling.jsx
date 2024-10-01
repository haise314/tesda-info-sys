import React, { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const Scheduling = () => {
  // State to store form data and scheduled events
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
  });
  const [schedule, setSchedule] = useState([]);

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
    setSchedule([...schedule, formData]);
    setFormData({ title: "", date: "", time: "" }); // Clear form after submission
  };

  return (
    <Container sx={{ flexGrow: 1, mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Dashboard Scheduling
        </Typography>

        {/* Scheduling Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="title"
                name="title"
                label="Event Title"
                variant="outlined"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                id="date"
                name="date"
                label="Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                id="time"
                name="time"
                label="Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Add to Schedule
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Scheduled Events */}
        <Typography variant="h6" gutterBottom>
          Scheduled Events
        </Typography>
        {schedule.length > 0 ? (
          <List>
            {schedule.map((event, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={event.title}
                  secondary={`${event.date} at ${event.time}`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No events scheduled yet.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Scheduling;

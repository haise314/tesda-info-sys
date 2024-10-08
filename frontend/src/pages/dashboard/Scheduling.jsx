import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs"; // Day.js for date manipulation

const TaskScheduler = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Ensure the use of dayjs object
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    uli: "",
    studentName: "",
    eventName: "",
    personnelAssigned: "",
    remarks: "",
  });

  const queryClient = useQueryClient();

  const { data: events = [] } = useQuery({
    queryKey: ["events"],
    queryFn: () => axios.get("/api/events").then((res) => res.data),
  });

  const addEventMutation = useMutation({
    mutationFn: (newEvent) => axios.post("/api/events", newEvent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setIsModalOpen(false);
      setFormData({
        uli: "",
        studentName: "",
        eventName: "",
        personnelAssigned: "",
        remarks: "",
      });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: (id) => axios.delete(`/api/events/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddEvent = () => {
    addEventMutation.mutate({ ...formData, date: selectedDate.toISOString() }); // Use the correct format for date storage
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        <Typography variant="h4" gutterBottom>
          Task Scheduler
        </Typography>
        <Box sx={{ mb: 2 }}>
          {" "}
          {/* Wrap DatePicker in LocalizationProvider */}
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={(newDate) => setSelectedDate(dayjs(newDate))} // Ensure the new date is handled as a dayjs object
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsModalOpen(true)}
            sx={{ ml: 2 }}
          >
            Add Event
          </Button>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Scheduled Events
            </Typography>
            <List>
              {events.map((event) => (
                <ListItem key={event._id}>
                  <ListItemText
                    primary={event.eventName}
                    secondary={`${dayjs(event.date).format("MM/DD/YYYY")} - ${
                      event.studentName
                    }`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => deleteEventMutation.mutate(event._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </Paper>
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>Add New Event</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="uli"
            label="ULI"
            type="text"
            fullWidth
            value={formData.uli}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="studentName"
            label="Student Name"
            type="text"
            fullWidth
            value={formData.studentName}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="eventName"
            label="Event Name"
            type="text"
            fullWidth
            value={formData.eventName}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="personnelAssigned"
            label="Personnel Assigned"
            type="text"
            fullWidth
            value={formData.personnelAssigned}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="remarks"
            label="Remarks"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={formData.remarks}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button onClick={handleAddEvent} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TaskScheduler;

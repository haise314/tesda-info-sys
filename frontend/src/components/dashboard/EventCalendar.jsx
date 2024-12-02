import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Typography,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const localizer = momentLocalizer(moment);

const fetchEvents = async () => {
  const response = await axios.get("/api/events");
  return response.data;
};

const EventCalendar = () => {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    uli: "",
    clientName: "",
    clientType: "",
    eventName: "",
    personnelAssigned: "",
    remarks: "",
  });

  const {
    data: events,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });

  // Validate date before submission
  const validateEventDate = (date) => {
    const today = dayjs().startOf("day");
    const maxFutureDate = today.add(2, "year");

    if (date.isBefore(today)) {
      setErrorMessage("Event date cannot be in the past.");
      return false;
    }

    if (date.isAfter(maxFutureDate)) {
      setErrorMessage("Event date cannot be more than 2 years in the future.");
      return false;
    }

    return true;
  };

  // Mutation for adding a new event
  const addEventMutation = useMutation({
    mutationFn: (newEvent) => axios.post("/api/events", newEvent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      resetForm();
    },
    onError: (error) => {
      setErrorMessage(error.response?.data?.message || "Failed to add event");
    },
  });

  // Mutation for updating an existing event
  const updateEventMutation = useMutation({
    mutationFn: (updatedEvent) =>
      axios.put(`/api/events/${updatedEvent._id}`, updatedEvent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      resetForm();
    },
    onError: (error) => {
      setErrorMessage(
        error.response?.data?.message || "Failed to update event"
      );
    },
  });

  // Mutation for deleting an event
  const deleteEventMutation = useMutation({
    mutationFn: (id) => axios.delete(`/api/events/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      resetForm();
    },
    onError: (error) => {
      setErrorMessage(
        error.response?.data?.message || "Failed to delete event"
      );
    },
  });

  const resetForm = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedEvent(null);
    setFormData({
      uli: "",
      clientName: "",
      clientType: "",
      eventName: "",
      personnelAssigned: "",
      remarks: "",
    });
    setSelectedDate(dayjs());
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddEvent = () => {
    // Validate form fields
    if (!formData.eventName) {
      setErrorMessage("Event Name is required.");
      return;
    }

    if (!formData.clientName) {
      setErrorMessage("Client Name is required.");
      return;
    }

    if (!formData.clientType) {
      setErrorMessage("Client Type is required.");
      return;
    }

    // Validate date
    if (!validateEventDate(selectedDate)) {
      return;
    }

    addEventMutation.mutate({
      ...formData,
      date: selectedDate.toISOString(),
    });
  };

  const handleUpdateEvent = () => {
    // Validate form fields
    if (!formData.eventName) {
      setErrorMessage("Event Name is required.");
      return;
    }

    if (!formData.clientName) {
      setErrorMessage("Client Name is required.");
      return;
    }

    if (!formData.clientType) {
      setErrorMessage("Client Type is required.");
      return;
    }

    // Validate date
    if (!validateEventDate(selectedDate)) {
      return;
    }

    updateEventMutation.mutate({
      ...formData,
      _id: selectedEvent._id,
      date: selectedDate.toISOString(),
    });
  };

  const handleDeleteEvent = () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      deleteEventMutation.mutate(selectedEvent._id);
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event.resource);
    setFormData({
      uli: event.resource.uli || "",
      clientName: event.resource.clientName,
      clientType: event.resource.clientType,
      eventName: event.resource.eventName,
      personnelAssigned: event.resource.personnelAssigned || "",
      remarks: event.resource.remarks || "",
    });
    setSelectedDate(dayjs(event.resource.date));
    setIsModalOpen(true);
    setIsEditMode(true);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Typography color="error">Error loading events</Typography>;
  }

  const eventList = events.map((event) => ({
    id: event._id,
    title: event.eventName || "Unnamed Event",
    start: new Date(event.date),
    end: new Date(event.date),
    allDay: true,
    resource: event,
  }));

  const EventComponent = ({ event }) => (
    <Typography
      variant="body2"
      style={{
        fontSize: "0.8rem",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {event.title} - {event.resource.clientName}
    </Typography>
  );

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">Event Calendar</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
        >
          Add New Event
        </Button>
      </Paper>

      <Paper
        elevation={3}
        sx={{ flexGrow: 1, height: "100%", overflow: "hidden" }}
      >
        <Calendar
          localizer={localizer}
          events={eventList}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          components={{
            event: EventComponent,
          }}
          onSelectEvent={handleSelectEvent}
        />
      </Paper>

      {/* Event Modal (Add/Edit) */}
      <Dialog open={isModalOpen} onClose={resetForm} maxWidth="md" fullWidth>
        <DialogTitle>{isEditMode ? "Edit Event" : "Add New Event"}</DialogTitle>
        <DialogContent>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={(newDate) => setSelectedDate(dayjs(newDate))}
            sx={{ width: "100%", mt: 2, mb: 2 }}
          />
          <TextField
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
            name="clientName"
            label="Client Name"
            type="text"
            fullWidth
            required
            value={formData.clientName}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense" required>
            <InputLabel>Client Type</InputLabel>
            <Select
              name="clientType"
              value={formData.clientType}
              onChange={handleInputChange}
              label="Client Type"
            >
              <MenuItem value="Student">Student</MenuItem>
              <MenuItem value="Faculty">Faculty</MenuItem>
              <MenuItem value="Staff">Staff</MenuItem>
              <MenuItem value="Guest">Guest</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="eventName"
            label="Event Name"
            type="text"
            fullWidth
            required
            value={formData.eventName}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="personnelAssigned"
            label="Personnel Assigned (Optional)"
            type="text"
            fullWidth
            value={formData.personnelAssigned}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="remarks"
            label="Remarks (Optional)"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={formData.remarks}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={resetForm}>Cancel</Button>
          {isEditMode ? (
            <>
              <Button onClick={handleUpdateEvent} color="primary">
                Update
              </Button>
              <Button onClick={handleDeleteEvent} color="error">
                Delete
              </Button>
            </>
          ) : (
            <Button onClick={handleAddEvent} color="primary">
              Add
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Error Snackbar */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setErrorMessage("")}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EventCalendar;

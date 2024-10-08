import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Typography, Paper, CircularProgress } from "@mui/material";
// ../../context/AuthContext
// Set up the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

const fetchEvents = async () => {
  const response = await axios.get("/api/events");
  return response.data;
};

const EventCalendar = () => {
  const {
    data: events,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });

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
    <Typography variant="body2" style={{ fontSize: "0.8rem" }}>
      {event.title}
      {event.resource.clientName && ` - ${event.resource.clientType}`}
    </Typography>
  );

  return (
    <Paper elevation={3} style={{ padding: "20px", height: "80vh" }}>
      <Calendar
        localizer={localizer}
        events={eventList}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        components={{
          event: EventComponent,
        }}
        onSelectEvent={(event) => {
          // Handle event click, e.g., show details in a modal
          console.log("Selected event:", event.resource);
        }}
      />
    </Paper>
  );
};

export default EventCalendar;

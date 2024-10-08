import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Typography, Paper, CircularProgress } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

const localizer = momentLocalizer(moment);

const fetchUserEvents = async (uli) => {
  const response = await axios.get(`/api/events/${uli}`);
  return response.data;
};

const UserEventCalendar = () => {
  const { user } = useAuth();
  const uli = user?.uli;

  const {
    data: events,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userEvents", uli],
    queryFn: () => fetchUserEvents(uli),
    enabled: !!uli,
  });

  if (!uli) {
    return <Typography>Please log in to view your events.</Typography>;
  }

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Typography color="error">Error loading your events</Typography>;
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
      {event.resource.clientName && ` - ${event.resource.clientName}`}
    </Typography>
  );

  return (
    <Paper elevation={3} style={{ padding: "20px", height: "80vh" }}>
      <Typography variant="h6" gutterBottom>
        Your Events
      </Typography>
      <Calendar
        localizer={localizer}
        events={eventList}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "calc(100% - 40px)" }}
        components={{
          event: EventComponent,
        }}
        onSelectEvent={(event) => {
          console.log("Selected event:", event.resource);
        }}
      />
    </Paper>
  );
};

export default UserEventCalendar;

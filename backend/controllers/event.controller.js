import Event from "../models/event.model.js";

const validateEventDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day

  const maxFutureDate = new Date();
  maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 2);

  const eventDate = new Date(date);

  if (eventDate < today) {
    throw new Error("Event date cannot be in the past.");
  }

  if (eventDate > maxFutureDate) {
    throw new Error("Event date cannot be more than 2 years in the future.");
  }
};

export const createEvent = async (req, res) => {
  try {
    // Validate required fields
    const { eventName, clientName, clientType, date } = req.body;

    if (!eventName) {
      return res.status(400).json({ message: "Event Name is required" });
    }

    if (!clientName) {
      return res.status(400).json({ message: "Client Name is required" });
    }

    if (!clientType) {
      return res.status(400).json({ message: "Client Type is required" });
    }

    // Validate date
    validateEventDate(date);

    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    // Validate required fields
    const { eventName, clientName, clientType, date } = req.body;

    if (!eventName) {
      return res.status(400).json({ message: "Event Name is required" });
    }

    if (!clientName) {
      return res.status(400).json({ message: "Client Name is required" });
    }

    if (!clientType) {
      return res.status(400).json({ message: "Client Type is required" });
    }

    // Validate date
    validateEventDate(date);

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const query = req.query.upcoming ? { date: { $gte: new Date() } } : {};
    const events = await Event.find(query).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventsUli = async (req, res) => {
  try {
    const { uli } = req.params;
    const query = { uli };
    if (req.query.upcoming) {
      query.date = { $gte: new Date() };
    }
    const events = await Event.find(query).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

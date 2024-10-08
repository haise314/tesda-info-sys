import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  uli: {
    type: String,
    required: true,
  },
  clientName: {
    type: String,
    required: false,
  },
  clientType: {
    type: String,
    enum: ["Student", "Faculty", "Staff", "Guest"],
    required: false,
  },
  eventName: {
    type: String,
    required: false,
  },
  personnelAssigned: {
    type: String,
    required: false,
  },
  remarks: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    required: true,
  },
});

const Event = mongoose.model("Event", eventSchema);

export default Event;

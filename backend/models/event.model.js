import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  uli: String,
  studentName: String,
  eventName: String,
  personnelAssigned: String,
  remarks: String,
  date: Date,
});

const Event = mongoose.model("Event", eventSchema);

export default Event;

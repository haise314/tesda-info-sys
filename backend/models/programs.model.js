// models/TrainingProgram.js
import mongoose from "mongoose";

const trainingProgramSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // Duration in hours or days
      required: true,
    },
    qualificationLevel: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    location: {
      type: String, // Address or Location in PTC Iba
      required: true,
    },
    trainer: {
      type: String, // Name of the trainer
      required: true,
    },
    slotsAvailable: {
      type: Number,
      required: true,
    },
    scholarshipAvailable: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TrainingProgram = mongoose.model(
  "TrainingProgram",
  trainingProgramSchema
);

export default TrainingProgram;

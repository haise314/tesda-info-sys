// controllers/trainingProgramController.js
import TrainingProgram from "../models/programs.model.js";

// Get all training programs
export const getAllPrograms = async (req, res) => {
  try {
    const programs = await TrainingProgram.find();
    res.status(200).json(programs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching training programs", error });
  }
};

// Get a single program by ID
export const getProgramById = async (req, res) => {
  const { id } = req.params;
  try {
    const program = await TrainingProgram.findById(id);
    if (!program) return res.status(404).json({ message: "Program not found" });
    res.status(200).json(program);
  } catch (error) {
    res.status(500).json({ message: "Error fetching program", error });
  }
};

// Create a new program
export const createProgram = async (req, res) => {
  const {
    name,
    description,
    duration,
    qualificationLevel,
    startDate,
    endDate,
    location,
    trainer,
    slotsAvailable,
    scholarshipAvailable,
  } = req.body;

  try {
    const newProgram = new TrainingProgram({
      name,
      description,
      duration,
      qualificationLevel,
      startDate,
      endDate,
      location,
      trainer,
      slotsAvailable,
      scholarshipAvailable,
    });
    await newProgram.save();
    res.status(201).json(newProgram);
  } catch (error) {
    res.status(500).json({ message: "Error creating program", error });
  }
};

// Update an existing program
export const updateProgram = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    duration,
    qualificationLevel,
    startDate,
    endDate,
    location,
    trainer,
    slotsAvailable,
  } = req.body;
  try {
    const updatedProgram = await TrainingProgram.findByIdAndUpdate(
      id,
      {
        name,
        description,
        duration,
        qualificationLevel,
        startDate,
        endDate,
        location,
        trainer,
        slotsAvailable,
      },
      { new: true }
    );
    if (!updatedProgram)
      return res.status(404).json({ message: "Program not found" });
    res.status(200).json(updatedProgram);
  } catch (error) {
    res.status(500).json({ message: "Error updating program", error });
  }
};

// Delete a program
export const deleteProgram = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProgram = await TrainingProgram.findByIdAndDelete(id);
    if (!deletedProgram)
      return res.status(404).json({ message: "Program not found" });
    res.status(200).json({ message: "Program deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting program", error });
  }
};

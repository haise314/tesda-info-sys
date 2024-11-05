import Assessment from "../models/assessments.model.js";

export const getAllAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find();
    res.status(200).json(assessments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching assessments", error });
  }
};

export const createAssessment = async (req, res) => {
  try {
    const newAssessment = new Assessment(req.body);
    await newAssessment.save();
    res.status(201).json(newAssessment);
  } catch (error) {
    res.status(500).json({ message: "Error creating assessment", error });
  }
};

export const deleteAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAssessment = await Assessment.findByIdAndDelete(id);
    if (!deletedAssessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }
    res.status(200).json({ message: "Assessment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting assessment", error });
  }
};

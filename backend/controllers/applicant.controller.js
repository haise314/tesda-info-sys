import Applicant from "../models/applicant.model.js";

// Create a new applicant
export const createApplicant = async (req, res) => {
  try {
    const applicant = new Applicant(req.body);
    const savedApplicant = await applicant.save();
    res.status(201).json({
      success: true,
      message: "Applicants retrieved successfully",
      data: savedApplicant,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all applicants
export const getApplicants = async (req, res) => {
  try {
    const applicants = await Applicant.find();
    res.status(200).json({
      success: true,
      message: "Applicants retrieved successfully",
      data: applicants,
    });
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};

// Get a single applicant by ID
export const getApplicantById = async (req, res) => {
  try {
    const applicant = await Applicant.findById(req.params.id);
    if (!applicant)
      return res
        .status(404)
        .json({ success: false, message: "Applicant not found" });
    res.status(200).json({ success: true, data: applicant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an applicant
export const updateApplicant = async (req, res) => {
  try {
    const updatedApplicant = await Applicant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedApplicant)
      return res
        .status(404)
        .json({ success: false, message: "Applicant not found" });
    res.status(200).json({
      success: true,
      message: "Applicant updated successfully",
      data: updatedApplicant,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete an applicant
export const deleteApplicant = async (req, res) => {
  try {
    const deletedApplicant = await Applicant.findByIdAndDelete(req.params.id);
    if (!deletedApplicant)
      return res
        .status(404)
        .json({ success: false, message: "Applicant not found" });
    res
      .status(200)
      .json({ success: true, message: "Applicant deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a new work experience to an applicant
export const addWorkExperience = async (req, res) => {
  try {
    const applicant = await Applicant.findById(req.params.id);
    if (!applicant)
      return res
        .status(404)
        .json({ success: false, message: "Applicant not found" });

    applicant.workExperience.push(req.body);
    const updatedApplicant = await applicant.save();
    res.status(200).json({
      success: true,
      message: "Work experience added successfully",
      data: updatedApplicant,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Add a new training/seminar to an applicant
export const addTrainingSeminar = async (req, res) => {
  try {
    const applicant = await Applicant.findById(req.params.id);
    if (!applicant)
      return res
        .status(404)
        .json({ success: false, message: "Applicant not found" });

    applicant.trainingSeminarAttended.push(req.body);
    const updatedApplicant = await applicant.save();
    res.status(200).json({
      success: true,
      message: "Training/seminar added successfully",
      data: updatedApplicant,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Add a new licensure examination to an applicant
export const addLicensureExamination = async (req, res) => {
  try {
    const applicant = await Applicant.findById(req.params.id);
    if (!applicant)
      return res
        .status(404)
        .json({ success: false, message: "Applicant not found" });

    applicant.licensureExaminationPassed.push(req.body);
    const updatedApplicant = await applicant.save();
    res.status(200).json({
      success: true,
      message: "Licensure examination added successfully",
      data: updatedApplicant,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Add a new competency assessment to an applicant
export const addCompetencyAssessment = async (req, res) => {
  try {
    const applicant = await Applicant.findById(req.params.id);
    if (!applicant)
      return res
        .status(404)
        .json({ success: false, message: "Applicant not found" });

    applicant.competencyAssessment.push(req.body);
    const updatedApplicant = await applicant.save();
    res.status(200).json({
      success: true,
      message: "Competency assessment added successfully",
      data: updatedApplicant,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

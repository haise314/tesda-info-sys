import Applicant from "../models/applicant.model.js";
import DeletedApplicant from "../models/Deleted/deletedApplicant.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "./user.controller.js";
import { generatePlaceholderPassword } from "./registrant.controller.js";
import User from "../models/user.model.js";
import ImageUpload from "../models/image.model.js";
import { upload } from "../config/multer.config.js";

// Function to generate ULI
const generateULI = (firstName, lastName, middleName, birthYear) => {
  // Get first letters of names, defaulting to 'X' if undefined
  const firstInitial = (firstName ? firstName[0] : "X").toUpperCase();
  const lastInitial = (lastName ? lastName[0] : "X").toUpperCase();
  const middleInitial = (middleName ? middleName[0] : "X").toUpperCase();

  // Extract last two digits of birth year
  const yearStr = birthYear.toString();
  const yearDigits =
    yearStr.length >= 4 ? yearStr.slice(-2) : yearStr.padStart(2, "0");

  // Generate a random 3-digit number (YYY)
  const randomNumbers = Math.floor(100 + Math.random() * 900); // Ensures a 3-digit number

  // Combine all parts
  return `${firstInitial}${lastInitial}${middleInitial}-${yearDigits}-${randomNumbers}-03907-001`;
};

export const createApplicant = async (req, res) => {
  try {
    const applicantData = req.body;

    // Check if assessmentTitle and assessmentType are submitted as individual fields
    let assessments = applicantData.assessments || [];

    if (
      !assessments.length &&
      applicantData.assessmentTitle &&
      applicantData.assessmentType
    ) {
      // If no assessments array is provided, create one using the individual fields
      assessments.push({
        assessmentTitle: applicantData.assessmentTitle,
        assessmentType: applicantData.assessmentType,
        applicationStatus: "For Approval", // Default status for new assessments
      });
    }

    // Check for other required fields
    if (
      !applicantData.name ||
      !applicantData.birthdate ||
      !applicantData.trainingCenterName ||
      !assessments.length // Ensure there's at least one assessment
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields or assessments",
      });
    }

    // Generate ULI
    const birthYear = new Date(applicantData.birthdate).getFullYear();
    const uli = generateULI(
      applicantData.name.firstName,
      applicantData.name.lastName,
      applicantData.name.middleName,
      birthYear
    );

    // Create the new applicant with ULI and assessments
    const newApplicant = new Applicant({
      ...applicantData,
      uli,
      assessments, // Store array of assessments
    });

    // Save to database
    await newApplicant.save();

    // Generate a random placeholder password
    const placeholderPassword = generatePlaceholderPassword();

    // Create the user with the unhashed password
    const user = new User({
      uli,
      password: placeholderPassword,
    });

    await user.save();

    // Generate a token to immediately log in the user
    const token = generateToken(user._id);

    // Send response
    res.status(201).json({
      success: true,
      message: "Applicant created successfully",
      data: {
        id: user._id,
        uli: user.uli,
        role: user.role,
        token,
        placeholderPassword,
      },
    });
  } catch (error) {
    console.error("Error in createApplicant:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update an applicant
export const updateApplicant = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // If assessments are being updated, ensure it's an array with at least one assessment
    if (updateData.assessments) {
      if (
        !Array.isArray(updateData.assessments) ||
        updateData.assessments.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Assessments must be an array with at least one assessment",
        });
      }
    }

    const updatedApplicant = await Applicant.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedApplicant) {
      return res
        .status(404)
        .json({ success: false, message: "Applicant not found" });
    }

    res.status(200).json({
      success: true,
      message: "Applicant updated successfully",
      data: updatedApplicant,
    });
  } catch (error) {
    console.error("Error in updateApplicant:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
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

export const deleteApplicant = async (req, res) => {
  try {
    const { id } = req.params;
    const applicant = await Applicant.findById(id);
    if (!applicant) {
      return res
        .status(404)
        .json({ success: false, message: "Applicant not found" });
    }
    // Create deleted record
    const deletedApplicant = new DeletedApplicant({
      ...applicant.toObject(),
      deletedAt: new Date(),
    });
    await deletedApplicant.save();
    await Applicant.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Applicant soft-deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error soft-deleting applicant",
      error: error.message,
    });
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

export const getApplicantByUli = async (req, res) => {
  try {
    const { uli } = req.params;
    const applicant = await Applicant.findOne({ uli });
    if (!applicant) {
      return res
        .status(404)
        .json({ success: false, message: "Applicant not found" });
    }
    res.status(200).json({ success: true, data: applicant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an assessment from an applicant
export const deleteAssessment = async (req, res) => {
  const { applicantId, assessmentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(applicantId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Applicant ID" });
  }

  try {
    const applicant = await Applicant.findById(applicantId);

    if (!applicant) {
      return res
        .status(404)
        .json({ success: false, message: "Applicant not found" });
    }

    // Find the index of the assessment to remove
    const assessmentIndex = applicant.assessments.findIndex(
      (assessment) => assessment._id.toString() === assessmentId
    );

    if (assessmentIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Assessment not found" });
    }

    // Remove the assessment from the array
    applicant.assessments.splice(assessmentIndex, 1);

    // Save the updated applicant
    await applicant.save();

    res.status(200).json({
      success: true,
      message: "Assessment deleted successfully",
      data: applicant,
    });
  } catch (error) {
    console.error("Error in deleteAssessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

import Applicant from "../models/applicant.model.js";
import DeletedApplicant from "../models/Deleted/deletedApplicant.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "./user.controller.js";
import { generatePlaceholderPassword } from "./registrant.controller.js";
import User from "../models/user.model.js";
import ImageUpload from "../models/image.model.js";
import { upload } from "../config/multer.config.js";
import mongoose from "mongoose";
import Registrant from "../models/registrant.model.js";
import {
  applicationStatuses,
  assessmentTypes,
} from "../utils/applicant.enums.js";

export const civilStatuesMap = {
  Single: "Single",
  Married: "Married",
  Separated: "Separated",
  Divorced: "Separated",
  Annulled: "Separated",
  Widower: "Widow/er",
  "Common Law/Live-in": "Married",
};

export const employmentStatusMap = {
  "Wage-Employed": "Permanent",
  Underemployed: "Casual",
  "Self-Employed": "Self-Employed",
  Unemployed: "Job Order",
};

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
      assessments.push({
        assessmentTitle: applicantData.assessmentTitle,
        assessmentType: applicantData.assessmentType,
        applicationStatus: "For Approval",
      });
    }

    // Check for required fields
    if (
      !applicantData.name ||
      !applicantData.birthdate ||
      !applicantData.trainingCenterName ||
      !assessments.length ||
      !applicantData.highestEducationalAttainment
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields or assessments",
      });
    }

    // Handle "Others" option for highestEducationalAttainment
    if (
      applicantData.highestEducationalAttainment === "Others" &&
      !applicantData.otherHighestEducationalAttainment
    ) {
      return res.status(400).json({
        success: false,
        message: "Please specify the other highest educational attainment",
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
      assessments,
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

// @desc    Update an applicant
export const updateApplicant = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Applicant ID" });
  }

  try {
    console.log("Updating applicant with id:", id);
    console.log("Update data received:", req.body);

    // Validate specific fields
    const {
      assessments,
      workExperience,
      trainingSeminarAttended,
      licensureExaminationPassed,
      competencyAssessment,
    } = req.body;

    // Validate assessments
    if (assessments) {
      const invalidAssessment = assessments.find(
        (assessment) =>
          !assessmentTypes.includes(assessment.assessmentType) ||
          !applicationStatuses.includes(assessment.applicationStatus)
      );
      if (invalidAssessment) {
        return res.status(400).json({
          success: false,
          message: "Invalid assessment type or status",
        });
      }
    }

    const existingApplicant = await Applicant.findById(id);
    if (!existingApplicant) {
      return res
        .status(404)
        .json({ success: false, message: "Applicant not found" });
    }

    // Update fields
    existingApplicant.uli = req.body.uli || existingApplicant.uli;
    existingApplicant.trainingCenterName =
      req.body.trainingCenterName || existingApplicant.trainingCenterName;
    existingApplicant.addressLocation =
      req.body.addressLocation || existingApplicant.addressLocation;

    // Replace entire arrays for complex nested documents
    if (assessments) existingApplicant.assessments = assessments;
    if (workExperience) existingApplicant.workExperience = workExperience;
    if (trainingSeminarAttended)
      existingApplicant.trainingSeminarAttended = trainingSeminarAttended;
    if (licensureExaminationPassed)
      existingApplicant.licensureExaminationPassed = licensureExaminationPassed;
    if (competencyAssessment)
      existingApplicant.competencyAssessment = competencyAssessment;

    existingApplicant.updatedBy = req.user?.id || "unknown";

    const updatedApplicant = await existingApplicant.save();
    console.log("Updated applicant in database:", updatedApplicant);

    res.status(200).json({ success: true, data: updatedApplicant });
  } catch (error) {
    console.error("Update error:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: "Server error" });
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

// @desc    Add an assessment to an applicant by ULI
export const addAssessmentByUli = async (req, res) => {
  try {
    const { uli } = req.params;
    console.log("Request body:", req.body);
    const {
      assessmentTitle,
      assessmentType,
      applicationStatus = "For Approval",
    } = req.body;

    if (!assessmentTitle || !assessmentType) {
      return res.status(400).json({
        success: false,
        message: "Assessment title and type are required",
      });
    }

    // Find the applicant by ULI
    const applicant = await Applicant.findOne({ uli });

    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: "Applicant not found",
      });
    }

    // Create the new assessment object
    const newAssessment = {
      assessmentTitle,
      assessmentType,
      applicationStatus,
    };

    // Add the assessment to the applicant's assessments array
    applicant.assessments.push(newAssessment);

    // Save the updated applicant
    await applicant.save();

    res.status(201).json({
      success: true,
      message: "Assessment added successfully",
      data: applicant,
    });
  } catch (error) {
    console.error("Error in addAssessmentByUli:", error);
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

export const createFromRegistrant = async (req, res) => {
  try {
    const { uli } = req.params;
    console.log("ULI:", uli);
    const {
      trainingCenterName,
      addressLocation,
      assessments,
      workExperience,
      trainingSeminarAttended,
      licensureExaminationPassed,
      competencyAssessment,
    } = req.body;

    // Check if applicant already exists for this ULI
    const existingApplicant = await Applicant.findOne({ uli });
    if (existingApplicant) {
      return res.status(400).json({
        success: false,
        message: "Application already exists for this ULI",
      });
    }

    // Validate required fields
    if (!trainingCenterName || !addressLocation) {
      return res.status(400).json({
        success: false,
        message: "Training center name and address location are required",
      });
    }

    // Validate assessments array
    if (
      !assessments ||
      !Array.isArray(assessments) ||
      assessments.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one assessment must be provided",
      });
    }

    // Validate each assessment
    for (const assessment of assessments) {
      if (!assessment.assessmentTitle || !assessment.assessmentType) {
        return res.status(400).json({
          success: false,
          message: "Assessment title and type are required for all assessments",
        });
      }
    }

    // Create new applicant
    const newApplicant = new Applicant({
      uli,
      trainingCenterName,
      addressLocation,
      assessments: assessments.map((assessment) => ({
        assessmentTitle: assessment.assessmentTitle,
        assessmentType: assessment.assessmentType,
        applicationStatus: assessment.applicationStatus || "For Approval",
      })),
      workExperience: workExperience || [],
      trainingSeminarAttended: trainingSeminarAttended || [],
      licensureExaminationPassed: licensureExaminationPassed || [],
      competencyAssessment: competencyAssessment || [],
    });

    // Save the applicant
    const savedApplicant = await newApplicant.save();

    return res.status(201).json({
      success: true,
      message: "Application created successfully",
      data: savedApplicant,
    });
  } catch (error) {
    // Handle specific MongoDB validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    // Handle other errors
    console.error("Error creating application:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

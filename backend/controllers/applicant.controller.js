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

    // Validate assessments if they are provided
    if (req.body.assessments) {
      if (!Array.isArray(req.body.assessments)) {
        return res.status(400).json({
          success: false,
          message: "Assessments must be an array",
        });
      }
      // Additional validation for each assessment item can be added here if needed
    }

    // Use findOneAndUpdate to get the old document before update
    const oldApplicant = await Applicant.findOne({ _id: id });

    if (!oldApplicant) {
      return res
        .status(404)
        .json({ success: false, message: "Applicant not found" });
    }

    // Merge the old document with the new data
    const updatedData = { ...oldApplicant.toObject(), ...req.body };

    // Update the document
    const updatedApplicant = await Applicant.findOneAndUpdate(
      { _id: id },
      updatedData,
      { new: true, runValidators: true }
    );

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
    const { uli } = req.body;
    console.log("Creating applicant from registrant with ULI:", uli);

    // Find existing registrant record
    const existingRegistrant = await Registrant.findOne({ uli });
    if (!existingRegistrant) {
      return res.status(404).json({ message: "Registrant record not found" });
    }

    // Map completeMailingAddress while preserving existing zipCode if provided
    const completeMailingAddress = {
      street: existingRegistrant.completeMailingAddress.street,
      barangay: existingRegistrant.completeMailingAddress.barangay,
      district: existingRegistrant.completeMailingAddress.district,
      city: existingRegistrant.completeMailingAddress.city,
      province: existingRegistrant.completeMailingAddress.province,
      region: existingRegistrant.completeMailingAddress.region,
      zipCode: req.body.completeMailingAddress?.zipCode || "",
    };

    // Map contact information while preserving any additional fields from req.body
    const contact = {
      email: existingRegistrant.contact.email,
      mobileNumber: existingRegistrant.contact.mobileNumber,
      telephoneNumber: req.body.contact?.telephoneNumber || "",
      fax: req.body.contact?.fax || "",
      others: req.body.contact?.others || "",
    };

    // Map educational attainment
    const educationMap = {
      "Elementary Undergraduate": "Elementary Graduate",
      "Elementary Graduate": "Elementary Graduate",
      "Junior High School Undergraduate": "High School Graduate",
      "Junior High School Graduate": "High School Graduate",
      "Senior High School Undergraduate": "High School Graduate",
      "Senior High School Graduate": "High School Graduate",
      "Post Secondary": "College Level",
      "College Undergraduate": "College Level",
      "College Graduate": "College Graduate",
      Masteral: "College Graduate",
      Doctoral: "College Graduate",
      "TVET Graduate": "TVET Graduate",
    };

    // Base fields from registrant
    const commonFields = {
      uli,
      name: existingRegistrant.name,
      completeMailingAddress,
      contact,
      sex: existingRegistrant.personalInformation.sex,
      civilStatus:
        civilStatuesMap[existingRegistrant.personalInformation.civilStatus] ||
        "Single",
      birthdate: existingRegistrant.personalInformation.birthdate,
      age: existingRegistrant.personalInformation.age,
      birthplace: existingRegistrant.personalInformation.birthplace.city,
      employmentStatus:
        employmentStatusMap[existingRegistrant.employmentStatus] ||
        "Self-Employed",
      highestEducationalAttainment:
        educationMap[existingRegistrant.education] || "Others",
      role: "client",
    };

    // Required fields that must come from req.body
    const requiredNewFields = {
      trainingCenterName: req.body.trainingCenterName,
      addressLocation: req.body.addressLocation,
      assessments: req.body.assessments,
      clientType: req.body.clientType,
      motherName: req.body.motherName,
      fatherName: req.body.fatherName,
    };

    // Optional arrays that should be initialized if not provided
    const optionalArrays = {
      workExperience: req.body.workExperience || [],
      trainingSeminarAttended: req.body.trainingSeminarAttended || [],
      licensureExaminationPassed: req.body.licensureExaminationPassed || [],
      competencyAssessment: req.body.competencyAssessment || [],
    };

    // Handle "Others" case for educational attainment
    if (commonFields.highestEducationalAttainment === "Others") {
      commonFields.otherHighestEducationalAttainment =
        req.body.otherHighestEducationalAttainment || "";
    }

    // Merge all the fields together
    const applicantData = {
      ...commonFields,
      ...requiredNewFields,
      ...optionalArrays,
    };

    console.log("New applicant data:", applicantData);

    // Validate required fields before saving
    const missingFields = [];
    for (const [key, value] of Object.entries(requiredNewFields)) {
      if (!value) missingFields.push(key);
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        fields: missingFields,
      });
    }

    const newApplicant = new Applicant(applicantData);
    await newApplicant.save();
    res.status(201).json(newApplicant);
  } catch (error) {
    console.error("Error creating applicant:", error);
    res.status(500).json({ message: error.message });
  }
};

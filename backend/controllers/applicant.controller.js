import Applicant from "../models/applicant.model.js";
import DeletedApplicant from "../models/Deleted/deletedApplicant.model.js";

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

// Create a new applicant
export const createApplicant = async (req, res) => {
  try {
    const applicantData = req.body;

    // Ensure required fields are provided
    if (
      !applicantData.name ||
      !applicantData.birthdate ||
      !applicantData.trainingCenterName
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Generate ULI
    const uli = generateULI(
      applicantData.name?.firstName,
      applicantData.name?.lastName,
      applicantData.name?.middleName,
      new Date(applicantData.birthdate).getFullYear() // Ensure birthdate is properly formatted
    );

    // Add ULI to applicant data
    applicantData.uli = uli;

    // Create new applicant with ULI
    const applicant = new Applicant(applicantData);
    const savedApplicant = await applicant.save();

    res.status(201).json({
      success: true,
      message: "Applicant created successfully",
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
      deletedBy: req.user?.name || "Unknown", // Assuming you have req.user from auth middleware
    });

    await deletedApplicant.save();
    await Applicant.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Applicant soft-deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error soft-deleting applicant" });
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

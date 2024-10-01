import Registrant from "../models/registrant.model.js";
import mongoose from "mongoose";

// @desc    Get all registrants
export const getRegistrants = async (req, res) => {
  try {
    const registrants = await Registrant.find();
    res.status(200).json({ success: true, data: registrants });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get single registrant by ID
export const getSingleRegistrant = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Registrant ID" });
  }

  try {
    const registrant = await Registrant.findById(id);

    if (!registrant) {
      return res
        .status(404)
        .json({ success: false, message: "Registrant not found" });
    }

    res.status(200).json({ success: true, data: registrant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Create a new registrant
export const createRegistrant = async (req, res) => {
  console.log("Request Body:", req.body);
  try {
    const {
      name,
      completeMailingAddress,
      contact,
      personalInformation,
      employmentType,
      employmentStatus,
      education,
      parent,
      clientClassification,
      disabilityType,
      disabilityCause,
      course,
      hasScholarType,
      scholarType,
    } = req.body;

    // Employment Type is required for the selected Employment Status
    if (
      (employmentStatus === "Wage-Employed" ||
        employmentStatus === "Underemployed") &&
      !employmentType
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Employment Type is required for the selected Employment Status",
      });
    }

    // Create the new registrant
    const newRegistrant = new Registrant({
      name,
      completeMailingAddress,
      contact,
      personalInformation,
      employmentStatus,
      employmentType,
      education,
      parent,
      clientClassification,
      disabilityType,
      disabilityCause,
      course,
      hasScholarType,
      scholarType,
    });

    // Save to database
    await newRegistrant.save();

    // Send response
    res.status(201).json({
      success: true,
      message: "Registrant created successfully",
      data: newRegistrant,
    });
  } catch (error) {
    console.error(error);

    // Check for validation error
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    // Handle server error
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Update a registrant
export const updateRegistrant = async (req, res) => {
  const { id } = req.params;

  // Check if the ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Registrant ID" });
  }

  try {
    const {
      name,
      completeMailingAddress,
      contact,
      nationality,
      personalInformation,
      education,
      parent,
      clientClassification,
      disabilityType,
      disabilityCause,
      course,
      scholarType,
      // consent,
    } = req.body;

    // Custom validations (if necessary)
    if (
      personalInformation &&
      (personalInformation.employmentStatus === "Wage-Employed" ||
        personalInformation.employmentStatus === "Underemployed") &&
      !personalInformation.employmentType
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Employment Type is required for the selected Employment Status",
      });
    }

    // if (consent === false || consent === undefined) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Consent is required to proceed",
    //   });
    // }

    // Find the registrant by ID and update it
    const updatedRegistrant = await Registrant.findByIdAndUpdate(
      id,
      {
        name,
        completeMailingAddress,
        contact,
        nationality,
        personalInformation,
        education,
        parent,
        clientClassification,
        disabilityType,
        disabilityCause,
        course,
        scholarType,
        // consent,
      },
      { new: true, runValidators: true } // new: true returns the updated document, runValidators ensures Mongoose validations are applied
    );

    if (!updatedRegistrant) {
      return res
        .status(404)
        .json({ success: false, message: "Registrant not found" });
    }

    // Send success response
    res.status(200).json({ success: true, data: updatedRegistrant });
  } catch (error) {
    console.error(error);

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Delete a registrant
export const deleteRegistrant = async (req, res) => {
  const { id } = req.params;

  // Check if the ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Registrant ID" });
  }

  try {
    // Find and delete the registrant by ID
    const deletedRegistrant = await Registrant.findByIdAndDelete(id);

    if (!deletedRegistrant) {
      return res
        .status(404)
        .json({ success: false, message: "Registrant not found" });
    }

    // Send success response
    res.status(200).json({
      success: true,
      message: "Registrant deleted successfully",
      data: deletedRegistrant,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

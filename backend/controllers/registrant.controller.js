import Registrant from "../models/registrant.model.js";
import mongoose from "mongoose";
import DeletedRegistrant from "../models/Deleted/deletedRegistrant.model.js";
import User from "../models/user.model.js";
import { generateToken } from "./user.controller.js";
import bcrypt from "bcryptjs";

// Function to generate a placeholder password
export const generatePlaceholderPassword = (length = 12) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  return password;
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
  console.log("Creating new registrant:", req.body);
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

    // Employment Type validation
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

    // Generate ULI
    const birthYear = new Date(personalInformation.birthdate).getFullYear();
    const uli = generateULI(
      name.firstName,
      name.lastName,
      name.middleName,
      birthYear
    );

    // Create the new registrant with ULI
    const newRegistrant = new Registrant({
      uli, // Add the ULI to the registrant data
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

    // Generate a random placeholder password
    const placeholderPassword = generatePlaceholderPassword();

    // Create the user with the unhashed password
    const user = new User({
      uli,
      password: placeholderPassword, // Store unhashed password
    });

    await user.save(); // The pre-save middleware will hash the password
    console.log("New user created:", user);

    // Generate a token to immediately log in the user
    const token = generateToken(user._id);
    console.log("Generated token:", token);

    // Send response
    res.status(201).json({
      success: true,
      message: "Registrant created successfully",
      data: {
        id: user._id,
        uli: user.uli,
        role: user.role,
        token, // JWT token for immediate login
        placeholderPassword, // Optional: you can display this to the user
      },
    });

    console.log("Registration response sent:", {
      uli: user.uli,
      role: user.role,
      token: token.substring(0, 10) + "...",
    });
  } catch (error) {
    console.error("Error in createRegistrant:", error);
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

// @desc    Update a registrant
export const updateRegistrant = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Registrant ID" });
  }

  try {
    console.log("Updating registrant with id:", id);
    console.log("Update data received:", req.body);

    const updatedRegistrant = await Registrant.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedRegistrant) {
      return res
        .status(404)
        .json({ success: false, message: "Registrant not found" });
    }

    console.log("Updated registrant in database:", updatedRegistrant);
    res.status(200).json({ success: true, data: updatedRegistrant });
  } catch (error) {
    console.error("Update error:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Soft delete a registrant and move to DeletedRegistrant collection
export const deleteRegistrant = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Registrant ID" });
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find the registrant
      const registrant = await Registrant.findById(id).session(session);

      if (!registrant) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(404)
          .json({ success: false, message: "Registrant not found" });
      }

      // Create a new DeletedRegistrant document
      const deletedRegistrant = new DeletedRegistrant(registrant.toObject());
      await deletedRegistrant.save({ session });

      // Remove the registrant from the main collection
      await Registrant.findByIdAndDelete(id).session(session);

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        success: true,
        message: "Registrant soft deleted successfully",
        data: deletedRegistrant,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getRegistrantByUli = async (req, res) => {
  try {
    const { uli } = req.params;
    console.log("Searching for ULI:", uli);

    const registrant = await Registrant.findOne({ uli: uli });
    console.log("Found registrant:", registrant);

    if (!registrant) {
      return res.status(404).json({
        success: false,
        message: "Registrant not found",
      });
    }

    res.status(200).json({
      success: true,
      data: registrant,
    });
  } catch (error) {
    console.error("Error in getRegistrantByUli:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

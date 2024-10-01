import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Registrant from "../models/registrant.model.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user (no need to hash the password here, the model will handle it)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password, // Store raw password, it will be hashed by the model
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase().trim();
    password = password.trim(); // Ensure no leading or trailing spaces

    console.log("Login attempt for email:", email);

    const user = await User.findOne({ email });

    if (!user) {
      console.log("Login failed: User not found");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("User found:", user.email);

    const isMatch = await user.matchPassword(password); // Use the model's method to compare
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      console.log("Login failed: Password does not match");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

export const loginRegistrant = async (req, res) => {
  try {
    let { email, birthdate } = req.body;
    email = email.toLowerCase().trim();

    console.log("Registrant login attempt for email:", email);
    console.log("Registrant login attempt for birthdate:", birthdate);

    const registrant = await Registrant.findOne({ "contact.email": email });

    if (!registrant) {
      console.log("Login failed: Registrant not found");
      return res.status(401).json({ message: "Invalid email or birthdate" });
    }

    // Convert dates to strings in YYYY-MM-DD format for comparison
    const storedBirthdate = new Date(registrant.personalInformation.birthdate)
      .toISOString()
      .split("T")[0];
    const providedBirthdate = new Date(birthdate).toISOString().split("T")[0];

    if (providedBirthdate !== storedBirthdate) {
      console.log("Login failed: Birthdate does not match");
      console.log("Stored birthdate:", storedBirthdate);
      console.log("Provided birthdate:", providedBirthdate);
      return res.status(401).json({ message: "Invalid email or birthdate" });
    }

    const token = generateToken(registrant._id);

    res.json({
      _id: registrant._id,
      name: `${registrant.name.firstName} ${registrant.name.lastName}`,
      email: registrant.contact.email,
      token: token,
      userType: "registrant",
    });
  } catch (error) {
    console.error("Registrant login error:", error);
    res.status(500).json({ message: "Server error during registrant login" });
  }
};

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }
  return jwt.sign({ id }, secret, {
    expiresIn: "30d",
  });
};

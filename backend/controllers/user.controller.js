import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Registrant from "../models/registrant.model.js";

export const registerUser = async (req, res) => {
  try {
    const { uli, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ uli });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = await User.create({
      uli,
      password,
      // role will be set to "client" by default
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        uli: user.uli,
        role: user.role,
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
    console.log("Login request body:", req.body);
    const { uli, password } = req.body;

    console.log("Login attempt for ULI:", uli);
    console.log("Login attempt for password:", password);
    const user = await User.findOne({ uli });

    if (!user) {
      console.log("Login failed: User not found");
      return res.status(401).json({ message: "Invalid ULI or password" });
    }

    console.log("User found:", user.uli);

    const isMatch = await user.matchPassword(password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      console.log("Login failed: Password does not match");
      return res.status(401).json({ message: "Invalid ULI or password" });
    }

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      uli: user.uli,
      role: user.role,
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

export const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }
  return jwt.sign({ id }, secret, {
    expiresIn: "30d",
  });
};

export const getUserByUli = async (req, res) => {
  try {
    const { uli } = req.params;
    const user = await User.findOne({ uli });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    const formattedUsers = users.map((user) => ({
      id: user._id.toString(), // Use _id as the id field
      uli: user.uli,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
    res.json(formattedUsers);
  } catch (error) {
    console.error("Error fetching users for table:", error);
    res.status(500).json({ message: "Server error while fetching users" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { uli } = req.params;
    const updateData = req.body;

    const user = await User.findOneAndUpdate({ uli }, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { uli, newPassword } = req.body;
    const user = await User.findOne({ uli });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Set the new password
    user.password = newPassword;

    // Save the user, which will trigger the pre-save middleware to hash the password
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error during password change" });
  }
};

export const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error while deleting user" });
  }
};

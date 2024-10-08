import Test from "../models/test.model.js";
import crypto from "crypto";

// Create a new test
export const createTest = async (req, res) => {
  try {
    const testCode = crypto.randomBytes(4).toString("hex").toUpperCase();
    const test = new Test({
      ...req.body,
      testCode,
    });
    const savedTest = await test.save();
    res.status(201).json({
      success: true,
      message: "Test created successfully",
      data: savedTest,
      testCode,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
// Get all tests
export const getAllTests = async (req, res) => {
  try {
    const tests = await Test.find();
    res.status(200).json({
      success: true,
      message: "Tests retrieved successfully",
      data: tests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single test by ID
export const getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test)
      return res
        .status(404)
        .json({ success: false, message: "Test not found" });
    res.status(200).json({ success: true, data: test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a test
export const updateTest = async (req, res) => {
  try {
    const updatedTest = await Test.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedTest)
      return res
        .status(404)
        .json({ success: false, message: "Test not found" });
    res.status(200).json({
      success: true,
      message: "Test updated successfully",
      data: updatedTest,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a test
export const deleteTest = async (req, res) => {
  try {
    const deletedTest = await Test.findByIdAndDelete(req.params.id);
    if (!deletedTest)
      return res
        .status(404)
        .json({ success: false, message: "Test not found" });
    res
      .status(200)
      .json({ success: true, message: "Test deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTestByCode = async (req, res) => {
  try {
    const testCode = req.params.testCode.toUpperCase();
    const test = await Test.findOne({ testCode });

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found with the provided test code",
      });
    }

    res.status(200).json({
      success: true,
      message: "Test retrieved successfully",
      data: test,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

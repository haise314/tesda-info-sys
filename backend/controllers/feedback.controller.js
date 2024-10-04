import Feedback from "../models/feedback.model.js";

// Create a new feedback
export const createFeedback = async (req, res) => {
  console.log(req.body);
  try {
    const feedback = new Feedback(req.body);
    const savedFeedback = await feedback.save();
    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: savedFeedback,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all feedback
export const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find();
    res.status(200).json({
      success: true,
      message: "Feedback retrieved successfully",
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single feedback by ID
export const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback)
      return res
        .status(404)
        .json({ success: false, message: "Feedback not found" });
    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a feedback
export const updateFeedback = async (req, res) => {
  try {
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedFeedback)
      return res
        .status(404)
        .json({ success: false, message: "Feedback not found" });
    res.status(200).json({
      success: true,
      message: "Feedback updated successfully",
      data: updatedFeedback,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a feedback
export const deleteFeedback = async (req, res) => {
  try {
    const deletedFeedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!deletedFeedback)
      return res
        .status(404)
        .json({ success: false, message: "Feedback not found" });
    res
      .status(200)
      .json({ success: true, message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import TestSession from "../models/testSession.model.js";
import Test from "../models/test.model.js";

export const startTestSession = async (req, res) => {
  try {
    const { uli, testCode } = req.body;

    // Find the test by test code
    const test = await Test.findOne({ testCode });
    if (!test) {
      return res
        .status(404)
        .json({ success: false, message: "Test not found" });
    }

    // Create a new test session
    const testSession = new TestSession({
      uli,
      test: test._id,
      testCode,
    });

    const savedTestSession = await testSession.save();

    res.status(201).json({
      success: true,
      message: "Test session started successfully",
      data: {
        sessionId: savedTestSession._id,
        testId: test._id,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getTestSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const testSession = await TestSession.findById(sessionId).populate("test");

    if (!testSession) {
      return res
        .status(404)
        .json({ success: false, message: "Test session not found" });
    }

    res.status(200).json({
      success: true,
      data: testSession,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const endTestSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { endTime } = req.body;

    const updatedSession = await TestSession.findByIdAndUpdate(
      sessionId,
      { endTime, status: "completed" },
      { new: true }
    );

    if (!updatedSession) {
      return res
        .status(404)
        .json({ success: false, message: "Test session not found" });
    }

    res.status(200).json({
      success: true,
      message: "Test session ended successfully",
      data: updatedSession,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

import TestSession from "../models/testSession.model.js";
import Test from "../models/test.model.js";
import Registrant from "../models/registrant.model.js"; // Assuming you have this model

export const startTestSession = async (req, res) => {
  try {
    const { registrantId, testCode } = req.body;

    // Find the registrant
    const registrant = await Registrant.findById(registrantId);
    if (!registrant) {
      return res
        .status(404)
        .json({ success: false, message: "Registrant not found" });
    }

    // Find the test by test code
    const test = await Test.findOne({ testCode });
    if (!test) {
      return res
        .status(404)
        .json({ success: false, message: "Test not found" });
    }

    // Create a new test session
    const testSession = new TestSession({
      registrant: registrantId,
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
    const testSession = await TestSession.findById(sessionId)
      .populate("registrant")
      .populate("test");

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

// Add other CRUD operations as needed

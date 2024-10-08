import AnswerSheet from "../models/answersheet.model.js";

export const createAnswerSheet = async (req, res) => {
  try {
    const { uli, testId, answers } = req.body;

    const answerSheet = new AnswerSheet({
      uli,
      testId,
      answers,
      date: new Date(),
    });

    const savedAnswerSheet = await answerSheet.save();
    res.status(201).json({
      success: true,
      message: "Answer sheet submitted successfully",
      data: savedAnswerSheet,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAnswerSheetByUli = async (req, res) => {
  try {
    const { uli } = req.params;
    const answerSheets = await AnswerSheet.find({ uli }).populate("testId");

    if (!answerSheets || answerSheets.length === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: "No answer sheets found for this ULI",
        });
    }

    res.status(200).json({
      success: true,
      data: answerSheets,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add other CRUD operations as needed

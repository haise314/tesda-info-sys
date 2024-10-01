import AnswerSheet from "../models/answersheet.model.js";

export const createAnswerSheet = async (req, res) => {
  try {
    const answerSheet = new AnswerSheet(req.body);
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

import AnswerSheet from "../models/answersheet.model.js";
import Result from "../models/results.model.js";
import Test from "../models/test.model.js";

export const getAllResults = async (req, res) => {
  try {
    const results = await Result.find({});
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const calculateResult = async (req, res) => {
  try {
    const { uli } = req.params;

    // Find the answersheet
    const answersheet = await Answersheet.findOne({ uli });
    if (!answersheet) {
      return res.status(404).json({ message: "Answersheet not found" });
    }

    // Find the corresponding test
    const test = await Test.findById(answersheet.testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // Calculate the score
    let score = 0;
    answersheet.answers.forEach((answer) => {
      const question = test.questions.find(
        (q) => q._id.toString() === answer.questionId.toString()
      );
      if (question) {
        const correctOption = question.options.find((opt) => opt.isCorrect);
        if (
          correctOption &&
          correctOption._id.toString() === answer.selectedOption.toString()
        ) {
          score++;
        }
      }
    });

    // Create or update the result
    const result = await Result.findOneAndUpdate(
      { uli, testCode: test.testCode },
      {
        uli,
        testCode: test.testCode,
        score,
        totalQuestions: test.questions.length,
      },
      { new: true, upsert: true }
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("Error calculating result:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getResult = async (req, res) => {
  try {
    const { uli, testCode } = req.params;
    const result = await Result.findOne({ uli, testCode });
    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRemarks = async (req, res) => {
  try {
    const { uli, testCode } = req.params;
    const { remarks } = req.body;

    const result = await Result.findOneAndUpdate(
      { uli, testCode },
      { remarks },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteResult = async (req, res) => {
  try {
    const { uli, testCode } = req.params;
    const result = await Result.findOneAndDelete({ uli, testCode });
    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }
    res.status(200).json({ message: "Result deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const calculateAllResults = async (req, res) => {
  try {
    // Find all answersheets and populate the testId reference
    const answersheets = await AnswerSheet.find({}).populate("testId");
    const results = [];

    // Process each answersheet
    for (const answersheet of answersheets) {
      if (!answersheet.testId) {
        console.log(`Skipping answersheet ${answersheet._id} - no test found`);
        continue;
      }

      // Check if result already exists
      const existingResult = await Result.findOne({
        uli: answersheet.uli,
        testId: answersheet.testId._id,
      });

      if (!existingResult) {
        // Calculate score
        let score = 0;
        answersheet.answers.forEach((answer) => {
          const question = answersheet.testId.questions.find(
            (q) => q._id.toString() === answer.questionId.toString()
          );

          if (question) {
            const correctOption = question.options.find((opt) => opt.isCorrect);
            if (
              correctOption &&
              correctOption._id.toString() === answer.selectedOption.toString()
            ) {
              score++;
            }
          }
        });

        // Create new result
        const newResult = await Result.create({
          uli: answersheet.uli,
          testId: answersheet.testId._id,
          testCode: answersheet.testId.testCode,
          subject: answersheet.testId.subject,
          score,
          totalQuestions: answersheet.testId.questions.length,
        });

        console.log("New result created:", newResult);
        results.push(newResult);
      } else {
        console.log(
          `Result already exists for ULI ${answersheet.uli} and test ${answersheet.testId._id}`
        );
      }
    }

    res.status(200).json({
      message: `Generated ${results.length} new results`,
      results,
    });
  } catch (error) {
    console.error("Error calculating all results:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserResults = async (req, res) => {
  try {
    const { uli } = req.params;
    console.log("Fetching results for ULI Controller:", uli);

    const results = await Result.find({ uli });
    console.log("Results found:", results);

    if (results.length === 0) {
      console.log("No results found for ULI:", uli);
      return res.status(404).json({ message: "No results found for this ULI" });
    }

    results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching user results:", error);
    res.status(500).json({ message: error.message });
  }
};

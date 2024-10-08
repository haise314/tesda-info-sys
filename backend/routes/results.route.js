import express from "express";
import {
  getAllResults,
  calculateResult,
  getResult,
  updateRemarks,
  deleteResult,
  calculateAllResults,
  getUserResults,
} from "../controllers/results.controller.js";

const router = express.Router();

// Get all results
router.get("/", getAllResults);

// Calculate and store result for a specific answersheet
router.post("/calculate/:uli", calculateResult);

// Get result for a specific user and test
router.get("/:uli/:testCode", getResult);

// Update remarks for a specific result
router.patch("/:uli/:testCode/remarks", updateRemarks);

// Delete a result
router.delete("/:uli/:testCode", deleteResult);

router.post("/calculate-all", calculateAllResults);

router.post("/getuser/:uli", getUserResults);

export default router;

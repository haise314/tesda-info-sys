import express from "express";
import {
  createApplicant,
  getApplicants,
  getApplicantByULI,
  updateApplicant,
  deleteApplicant,
  addWorkExperience,
  addTrainingSeminar,
  addLicensureExamination,
  addCompetencyAssessment,
  getApplicantByUli,
  deleteAssessment,
  addAssessmentByUli,
  createFromRegistrant,
} from "../controllers/applicant.controller.js";

const router = express.Router();

// Base routes
router.post("/", createApplicant);
router.get("/", getApplicants);
router.get("/:uli", getApplicantByULI);
router.put("/:uli", updateApplicant);
router.delete("/:id", deleteApplicant);
router.get("/uli/:uli", getApplicantByUli);
router.delete("/:applicantId/assessments/:assessmentId", deleteAssessment);
router.post("/:uli/assessment", addAssessmentByUli);
router.post("/:uli/create-from-registrant", createFromRegistrant);

// Dynamic field addition routes
router.post("/:id/work-experience", addWorkExperience);
router.post("/:id/training-seminar", addTrainingSeminar);
router.post("/:id/licensure-examination", addLicensureExamination);
router.post("/:id/competency-assessment", addCompetencyAssessment);

export default router;

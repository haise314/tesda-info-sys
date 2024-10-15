import express from "express";
import {
  createApplicant,
  getApplicants,
  getApplicantById,
  updateApplicant,
  deleteApplicant,
  addWorkExperience,
  addTrainingSeminar,
  addLicensureExamination,
  addCompetencyAssessment,
  getApplicantByUli,
  deleteAssessment,
} from "../controllers/applicant.controller.js";

const router = express.Router();

// Base routes
router.post("/", createApplicant);
router.get("/", getApplicants);
router.get("/:id", getApplicantById);
router.put("/:id", updateApplicant);
router.delete("/:id", deleteApplicant);
router.get("/uli/:uli", getApplicantByUli);
router.delete("/:applicantId/assessments/:assessmentId", deleteAssessment);

// Dynamic field addition routes
router.post("/:id/work-experience", addWorkExperience);
router.post("/:id/training-seminar", addTrainingSeminar);
router.post("/:id/licensure-examination", addLicensureExamination);
router.post("/:id/competency-assessment", addCompetencyAssessment);

export default router;

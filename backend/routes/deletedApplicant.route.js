import express from "express";
import {
  getDeletedApplicantById,
  getDeletedApplicants,
} from "../controllers/deletedApplicant.controller.js";

const router = express.Router();

router.get("/", getDeletedApplicants);
router.get("/:id", getDeletedApplicantById);

export default router;

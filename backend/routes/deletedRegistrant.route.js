import express from "express";
import {
  getDeletedRegistrants,
  getDeletedRegistrantById,
} from "../controllers/deletedRegistrant.controller.js";

const router = express.Router();

router.get("/", getDeletedRegistrants);
router.get("/:id", getDeletedRegistrantById);

export default router;

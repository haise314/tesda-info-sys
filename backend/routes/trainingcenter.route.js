import express from "express";
import {
  getAllCenters,
  createCenter,
  deleteCenter,
} from "../controllers/trainingcenter.controller.js";

const router = express.Router();

router.get("/", getAllCenters);
router.post("/", createCenter);
router.delete("/:id", deleteCenter);

export default router;

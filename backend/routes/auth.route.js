import express from "express";
import {
  loginRegistrant,
  loginUser,
  registerUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/login-registrant", loginRegistrant);

export default router;

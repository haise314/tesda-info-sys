import express from "express";
import {
  getUserByUli,
  loginRegistrant,
  loginUser,
  registerUser,
  getAllUsers,
  updateUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/login-registrant", loginRegistrant);
router.get("/:uli", getUserByUli);
router.get("/users", getAllUsers);
router.put("/users/:uli", updateUser);

export default router;

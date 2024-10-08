import express from "express";
import {
  getUserByUli,
  loginRegistrant,
  loginUser,
  registerUser,
  getAllUsers,
  updateUser,
  changePassword,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/login-registrant", loginRegistrant);
router.get("/:uli", getUserByUli);
router.post("/users", getAllUsers);
router.put("/users/:uli", updateUser);
router.put("/change-password", changePassword);

export default router;

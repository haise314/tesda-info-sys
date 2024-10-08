import express from "express";
import {
  getUserByUli,
  loginRegistrant,
  loginUser,
  registerUser,
  getAllUsers,
  updateUser,
  changePassword,
  updateUserById,
  deleteUserById,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/login-registrant", loginRegistrant);
router.get("/:uli", getUserByUli);
router.post("/users", getAllUsers);
router.put("/users/:uli", updateUser);
router.put("/change-password", changePassword);
router.put("/users/update/:id", updateUserById);
router.delete("/users/delete/:id", deleteUserById);

export default router;

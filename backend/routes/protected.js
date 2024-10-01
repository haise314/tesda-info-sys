const express = require("express");
const { verifyToken, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

// Protected route for all authenticated users
router.get("/user", verifyToken, (req, res) => {
  res.json({ message: "Welcome, authenticated user!" });
});

// Protected route for admin users only
router.get("/admin", verifyToken, authorizeRoles(["admin"]), (req, res) => {
  res.json({ message: "Welcome, admin!" });
});

module.exports = router;

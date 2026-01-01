const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { getEmployeeActivity, getAllEmployees } = require("../controllers/adminController");

// Fetch employee activity (attendance + tasks)
router.get("/employee-activity", authMiddleware, adminMiddleware, getEmployeeActivity);

// Fetch all employees only
router.get("/users", authMiddleware, adminMiddleware, getAllEmployees);

module.exports = router;

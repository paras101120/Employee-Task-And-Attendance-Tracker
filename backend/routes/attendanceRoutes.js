const express = require("express");
const router = express.Router();
const { markAttendance, getMyAttendance } = require("../controllers/attendanceController");
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/attendance
router.post("/", authMiddleware, markAttendance);

// GET /api/attendance/my-attendance
router.get("/my-attendance", authMiddleware, getMyAttendance);

module.exports = router;

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  markAttendance,
  getMyTasks,
  completeTask
} = require("../controllers/employeeController");

router.post("/attendance", authMiddleware, markAttendance);
router.get("/tasks", authMiddleware, getMyTasks);
router.put("/tasks/:id", authMiddleware, completeTask);

module.exports = router;

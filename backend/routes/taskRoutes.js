const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const { assignTask, getMyTasks, completeTask } = require("../controllers/taskController");

router.post("/", authMiddleware, adminMiddleware, assignTask);
router.get("/my-tasks", authMiddleware, getMyTasks);
router.put("/:id/complete", authMiddleware, completeTask);

module.exports = router;

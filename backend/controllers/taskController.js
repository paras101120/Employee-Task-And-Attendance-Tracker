const Task = require("../models/Task");
const User = require("../models/User");

exports.assignTask = async (req, res) => {
  try {
    const { employeeId, title, description } = req.body;

    if (!employeeId || !title) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Make sure employee exists
    const employee = await User.findById(employeeId);
    if (!employee || employee.role !== "employee") {
      return res.status(400).json({ message: "Invalid employee" });
    }

    const task = await Task.create({
      employee: employeeId, // Must match Task model
      title,
      description,
      status: "Pending",
    });

    res.json({ message: "Task assigned successfully", task });
  } catch (error) {
    console.error("Assign Task Error:", error); // This logs the real error
    res.status(500).json({ message: "Failed to assign task" });
  }
};

// Fetch tasks for logged-in employee
exports.getMyTasks = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tasks = await Task.find({
      employee: employeeId,
      createdAt: { $gte: today, $lt: tomorrow }
    });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

// Complete a task
exports.completeTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (task.employee.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    task.status = "Completed";
    await task.save();
    res.json({ message: "Task completed successfully" });
  } catch (error) {
    console.error("Error completing task:", error);
    res.status(500).json({ message: "Failed to complete task" });
  }
};

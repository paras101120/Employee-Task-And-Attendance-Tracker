const Attendance = require("../models/Attendance");
const Task = require("../models/Task");

exports.markAttendance = async (req, res) => {
  try {
    const { status } = req.body;

    const today = new Date().toISOString().slice(0, 10);

    await Attendance.findOneAndUpdate(
      { employee: req.user.id, date: today },
      { status },
      { upsert: true, new: true }
    );

    res.json({ message: "Attendance marked" });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark attendance" });
  }
};

exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ employee: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

exports.completeTask = async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, {
      status: "Completed"
    });

    res.json({ message: "Task marked as completed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update task" });
  }
};

const User = require("../models/User");
const Attendance = require("../models/Attendance");
const Task = require("../models/Task");

exports.getEmployeeActivity = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const employees = await User.find({ role: "employee" });

    const data = await Promise.all(
      employees.map(async (emp) => {
        const attendance = await Attendance.findOne({
          employee: emp._id,
          date: today,
        });

        const tasks = await Task.find({
          employee: emp._id,
          createdAt: { $gte: today, $lt: tomorrow }
        });

        return {
          _id: emp._id,
          name: emp.name,
          email: emp.email,
          attendance: attendance ? attendance.status : null,
          tasks: tasks.map((t) => ({ title: t.title, status: t.status, date: t.createdAt })),
        };
      })
    );

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch employee activity" });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("_id name email");
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};

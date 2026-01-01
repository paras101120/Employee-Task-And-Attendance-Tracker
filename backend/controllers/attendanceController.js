const Attendance = require("../models/Attendance");

exports.markAttendance = async (req, res) => {
  try {
    const employeeId = req.user?._id; // req.user comes from authMiddleware
    if (!employeeId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { status } = req.body; // Must be "Present" or "Absent"
    if (!status || !["Present", "Absent"].includes(status)) {
      return res.status(400).json({ message: "Invalid attendance status" });
    }

    // Today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if attendance already marked
    const existing = await Attendance.findOne({ employee: employeeId, date: today });
    if (existing) {
      return res.status(400).json({ message: "Attendance already marked" });
    }

    const attendance = await Attendance.create({
      employee: employeeId,
      status,
      date: today,
    });

    res.json({ message: "Attendance marked successfully", attendance });
  } catch (error) {
    console.error("Error in markAttendance:", error);
    res.status(500).json({ message: "Failed to mark attendance" });
  }
};

exports.getMyAttendance = async (req, res) => {
  try {
    const employeeId = req.user?._id;
    if (!employeeId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({ employee: employeeId, date: today });
    res.json({ status: attendance ? attendance.status : null });
  } catch (error) {
    console.error("Error in getMyAttendance:", error);
    res.status(500).json({ message: "Failed to fetch attendance" });
  }
};

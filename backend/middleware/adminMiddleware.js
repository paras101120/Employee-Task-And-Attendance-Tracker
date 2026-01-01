const User = require("../models/User");

const adminMiddleware = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    next();
  } catch (error) {
    res.status(403).json({ message: "Admin access denied" });
  }
};

module.exports = adminMiddleware;

const expressJwt = require("express-jwt");
const bcrypt = require("bcrypt");
const User = require("../models/user");

// middleware to run if we want to make sure/check that the user is logged in
exports.requireSignin = expressJwt({
  getToken: (req, res) => req.cookies.token,
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

// re-write this and rename to isSupervisor, remove the part where we check if not role includes admin
// we only need to match the user with the role instructor
exports.isInstructor = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.role.includes("Instructor") && !user.role.includes("Admin")) {
      return res.status(403).json({
        error: "Instructor permission required!",
      });
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Error while fetching data!" });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.role.includes("Admin")) {
      return res.status(403).json({
        error: "Admin permission required!",
      });
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Error while fetching data!" });
  }
};

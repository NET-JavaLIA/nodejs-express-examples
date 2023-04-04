// line 2 and 3 are required for all route files
const express = require("express");
const router = express.Router();

// middlewares
const { runValidation } = require("../validators");
const { requireSignin } = require("../middlewares");
const { isAdmin } = require("../middlewares/auth");

// controllers
const {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  publishCourse,
  unpublishCourse,
} = require("../controllers/course");

router.get("/courses", requireSignin, runValidation, getAllCourses);
router.get("/course/:slug", requireSignin, runValidation, getSingleCourse);
router.post("/course", requireSignin, createCourse);
router.put(
  "/course/:slug",
  requireSignin,
  runValidation,
  isAdmin,
  updateCourse
);
router.put(
  "/course/publish/:id",
  requireSignin,
  runValidation,
  isAdmin,
  publishCourse
);
router.put(
  "/course/unpublish/:id",
  requireSignin,
  runValidation,
  isAdmin,
  unpublishCourse
);

// this line is required for all route files
module.exports = router;

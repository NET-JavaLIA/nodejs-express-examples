const { default: slugify } = require("slugify");
const Course = require("../models/course");

exports.createCourse = async (req, res) => {
  try {
    const course = await new Course({
      ...req.body,
    }).save();
    res.json(course);
  } catch (err) {
    console.log(err);
    res.status(400).send("Course create failed. Try again.");
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      { published: true, published: false },
      { title: 1, category: 1 }
    )
      .sort({ createdAt: 1 })
      .exec();
    return res.status(200).json(allCourses);
  } catch (err) {
    console.log(err);
    res.status(400).send("Error while getting all courses. Try again.");
  }
};

exports.getSingleCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug })
      .populate("instructor", "_id first_name last_name")
      .exec();
    res.json(course);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error while finding course. Try again.");
  }
};

exports.updateCourse = async (req, res) => {
  try {
    if (req.body.title) {
      updatedSlug = slugify(req.body.title).toLowerCase();
      req.body.slug = updatedSlug;
    }
    const updated = await Course.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    ).exec();
    res.json(updated);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error while updating course. Try again.");
  }
};

exports.publishCourse = async (req, res) => {
  try {
    published = true;
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { published },
      { new: true }
    ).exec();
    res.json(course);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error while publishing course. Try again");
  }
};

exports.unpublishCourse = async (req, res) => {
  try {
    published = false;
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { published },
      { new: true }
    ).exec();
    res.json(course);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error while unpublishing course. Try again");
  }
};

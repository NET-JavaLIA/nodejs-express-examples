// skit i allt som har med slug eller slugify
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
    // ni kan prova att bara använda find() och inte lägga till select m.m det ni behöver avsluta
    // med i så fall är exec();
    // select() = väljer vilka fält från modellen ni vill hämta
    // populate() populera fält på en referens och välja vilka fält man vill ha med i responsen
    // sort() sorterar man kan köra 1 eller testa -1
    const allCourses = await Course.find()
      .select("title category instructor")
      .populate("instructor", "first_name last_name")
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
    // normalt sett så letar efter en specifik entity med id inte med slug
    // man kan använda findById()
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
    // ej relevant för er
    if (req.body.title) {
      updatedSlug = slugify(req.body.title).toLowerCase();
      req.body.slug = updatedSlug;
    }
    // här är det relevant
    const updated = await Course.findOneAndUpdate(
      // här letar ni efter id istället
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

// kanske går att ha som underlag till activate/deactivate
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

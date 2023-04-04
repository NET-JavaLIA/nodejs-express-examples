const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const stepSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    content: {
      type: {},
    },
    published: {
      type: Boolean,
      default: false,
    },
    video: {},
    preview: {
      type: Boolean,
      default: false,
    },
    comments: [
      {
        text: String,
        created: { type: Date, default: Date.now },
        posted_by: {
          type: ObjectId,
          ref: "User",
        },
      },
    ],
  },
  { timestamps: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    /* slug: {
      type: String,
      lowercase: true,
    },*/
    category: {
      type: [String],
      enum: [
        "JavaScript",
        "React",
        "Java",
        "Databases",
        "C#",
        "Backend",
        "Frontend",
        "Design",
      ],
    },
    description: {
      type: {},
      required: true,
    },
    image: {},
    published: {
      type: Boolean,
      default: false,
    },
    instructor: [
      {
        type: ObjectId,
        ref: "User",
        required: true,
      },
    ],
    created_by: {
      type: ObjectId,
      ref: "User",
    },
    steps: [stepSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);

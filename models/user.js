const mongoose = require("mongoose");
const crypto = require("crypto");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    hashed_password: {
      type: String,
      required: true,
      minLength: 6,
    },
    studentClass: {
      type: String,
      trim: true,
      required: true,
    },
    role: {
      type: [String],
      default: ["Student"],
      enum: ["Student", "Supervisor", "Admin"],
    },
    ul: {
      type: ObjectId,
      ref: "User",
    },
    supervisor: [
      {
        type: ObjectId,
        ref: "User",
        // Add required?
      },
    ],
    // Add phone number?
  },
  { timestamps: true }
);
// virtual fields
userSchema
  .virtual("password")
  .set(function (password) {
    // create temp variable called _password
    this._password = password;
    // generate salt
    this.salt = this.makeSalt();
    // encrypt password
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });
// methods > authenticate, encryptPassword, makeSalt
userSchema.methods = {
  // kolla om lösenordet usern skriver in vid inlogg är samma som det vi sparat i db
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      // OBS! INSTALLERA CRYPTO
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

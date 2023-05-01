const express = require("express");
const router = express.Router();

// middlewares
const {
  userRegisterValidator,
  userLoginValidator,
} = require("../validators/auth");

const { runValidation } = require("../validators");

const { requireSignin } = require("../middlewares");

const { isAdmin } = require("../middlewares/index");

// controllers
const {
  register,
  login,
  currentUser,
  registerActivate,
  forgotPassword,
  resetPassword,
  logout,
} = require("../controllers/auth");

router.post("/login", userLoginValidator, runValidation, login);
router.get("/current-user", requireSignin, currentUser);

router.get("/logout", logout);

module.exports = router;

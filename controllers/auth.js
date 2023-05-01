const User = require("../models/user");

// LOGIN WITH TOKEN!
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).exec();
    if (!user)
      return res.status(400).send("Email and password does not match.");

    // authenticate
    // this encrypts password so make sure you do as well!
    // i wrote this method in the user model dont think you did that...
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email and password does not match.",
      });
    }

    // created signed jwt
    // OBS! You need to add JWT_SECRET to env file, can be:
    // JWT_SECRET=fjewoihgrobeifjhiodhjniodfbhrioewjrioewhjf
    const token = jwtToken.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
      // we should not use 7 days in production make sure to comment this
    });

    //return user and token to client, exclude hashed password
    user.password = undefined;

    // send token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      //secure: true, // only works on https
    });
    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};

// get current logged in user
exports.currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-hashed_password")
      .exec();
    console.log("CURRENT USER ", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

// remove cookie when logged out
exports.logout = (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "Sucessfully signed out." });
  } catch (err) {
    console.log(err);
  }
};

exports.signup = (req, res) => {
  //console.log('req.body', req.body);
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        message: "error...",
      });
    }
    user.hashed_password = undefined;
    res.json({
      user,
    });
  });
};

exports.signin = (req, res) => {
  //find the user based on email
  // destructure
  // kort sagt så plockar man ut dom fälten man vill ha ifrån tex user
  // vi vill bara ha email och password vi vill inte ha dom andra fälten.
  // kanske får ändra till hashed_password
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User doesnt exist, please signup",
      });
    }
    //if user is found make sure the email and pw match
    //create authenticate method in user model
    // authenticate kommer från user model och är en metod som kollar att lösenordet stämmer
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password dont match",
      });
    }

    //return response with user to frontend client
    const { _id, name, email, role } = user;
    return res.json({ user: { _id, email, name, role } });
  });
};

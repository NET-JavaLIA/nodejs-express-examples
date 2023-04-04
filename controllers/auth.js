const User = require("../models/user");

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
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User doesnt exist, please signup",
      });
    }
    //if user is found make sure the email and pw match
    //create authenticate method in user model
    // TA BORT authenticate(password) och kolla bara om man email + password matchar
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

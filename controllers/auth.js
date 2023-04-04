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

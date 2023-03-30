const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        password: hash,
        gender: req.body.gender,
        country: req.body.country,
        city: req.body.city,
        streetAddress: req.body.streetAddress,
        secondStreetAddress: req.body.secondStreetAddress,
        zipCode: req.body.zipCode,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "User Created" }))
        .catch((e) => console.log(e));
    })
    .catch((e) => console.log(e));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "Both email/password incorrect" });
        //we don't have to annoce that the user is not in our database (security concepts)
      }
      bcrypt.compare(req.body.password, user.password).then((valid) => {
        if (!valid) {
          return res
            .status(401)
            .json({ message: "Both email/password incorrect" });
        }
        res.status(200).json({
          userId: user._id,
          token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
            expiresIn: "6h",
          }),
        });
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

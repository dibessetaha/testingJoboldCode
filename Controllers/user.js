const User = require("../models/user");
const bcrypt = require("bcrypt");
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
        .catch((error) => res.status(400).json({ error: "cannot save user" }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.emial })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "Both email/password incorrecte" });
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
            expireIn: "24h",
          }),
        });
      });
    })
    .catch();
};

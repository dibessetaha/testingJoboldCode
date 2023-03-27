const e = require("express");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const userRoutes = require("./routes/user");

mongoose
  .connect(
    "mongodb+srv://tdibesse:admin@cluster0.iymtkl6.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      socketTimeoutMS: 0,
    }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((e) => console.log(e));

app.use(express.json());

app.use("/api/auth", userRoutes);

module.exports = app;

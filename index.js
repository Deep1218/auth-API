const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("passport");

require("./config/db-config");
require("./config/passport-config");

const authRoutes = require("./modules/Auth/route");

const app = express();

const port = process.env.PORT || 3000;

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    maxAge: 24 * 60 * 60 * 1000,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);

app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log("Server is up on port " + port);
});

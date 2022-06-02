const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");

require("./config/db-config");
require("./config/passport-config");

const authRoutes = require("./modules/Auth/route");

const app = express();

const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    maxAge: 24 * 60 * 60 * 1000,
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});

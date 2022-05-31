const router = require("express").Router();
const passport = require("passport");
const auth = require("./commanMiddleware");
const User = require("../../model/users");

// auth login
router.post("/login", auth, async (req, res) => {
  try {
    try {
      const user = await User.findByCredentials(
        req.body.email,
        req.body.password
      );

      const token = jwt.sign({ _id: user._id.toString() }, "loginPages");
      console.log("currentToken", token);

      res
        .cookie("authToken", token, {
          httpOnly: true,
        })
        .status(200)
        .send({ message: "Logged in successfully", user });
    } catch (error) {
      res.status(400).send({ error });
    }
  } catch (error) {}
});

// auth logout
router.get("/logout", auth, (req, res, next) => {
  try {
    req.logout((error) => {
      console.log(error);
      if (error) {
        throw new Error(error);
      }
      res.clearCookie("authToken");
      res.status(200).send({ message: "Logged out" });
    });
  } catch (error) {
    res.status(400).send({ error });
  }
});

// auth with google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// callback route for google to redirect to
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  // res.send(req.user);
  try {
    console.log("userId", req.user.id);
    const token = jwt.sign({ _id: req.user._id.toString() }, "loginPages");
    console.log("currentToken", token);
    res
      .cookie("authToken", token, {
        httpOnly: true,
      })
      .status(200)
      .send({ message: "Logged in successfully", user: req.user });
    // res.cookie("currentUser", req.user);
    // res.redirect("http://localhost:4200/home");
  } catch (error) {
    res.status(400).send({ error });
  }
});

module.exports = router;

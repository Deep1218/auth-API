const router = require("express").Router();
const passport = require("passport");

// auth login
// router.get("/login", (req, res) => {
//   res.render("login", { user: req.user });
// });

// auth logout
router.get("/logout", (req, res, next) => {
  req.logout((error) => {
    console.log(error);
    if (error) {
      return { error };
    }
    res.clearCookie("currentUser");
    res.redirect("http://localhost:4200/loginOne");
  });
});

// auth with google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  // res.send(req.user);
  res.cookie("currentUser", req.user);
  res.redirect("http://localhost:4200/home");
});

module.exports = router;

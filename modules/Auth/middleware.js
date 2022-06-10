const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

// auth with google login
router.get(
  "/login",
  passport.authenticate("login-google", {
    scope: ["profile", "email"],
  })
);
// auth with google sign
router.get(
  "/signup",
  passport.authenticate("signup-google", {
    scope: ["profile", "email"],
  })
);

// callback route for google to redirect to
router.get(
  "/loginRedirect",
  passport.authenticate("login-google", { session: false }),
  (req, res) => {
    try {
      console.log("Login", req._error);
      console.log("Login", req._user);
      if (req._error) {
        res
          .cookie("error", req._error)
          .status(400)
          .redirect("http://localhost:4200/loginOne");
      } else {
        //generate token
        const token = jwt.sign(
          { _id: req._user[0]._id.toString() },
          "loginPages"
        );
        console.log("currentToken", token);
        // response token save to cookie
        res
          .cookie("authToken", token)
          .status(200)
          .redirect("http://localhost:4200/home");
      }
    } catch (error) {
      console.log(error);
    }
  }
);

// callback route for google sign to redirect
router.get(
  "/signupRedirect",
  passport.authenticate("signup-google", { session: false }),
  (req, res) => {
    try {
      console.log("Signup", req._error);
      console.log("Signup", req._user);
      if (req._error) {
        res
          .cookie("error", req._error)
          .status(400)
          .redirect("http://localhost:4200/loginOne/newAccount");
      } else {
        //generate token
        const token = jwt.sign({ _id: req._user._id.toString() }, "loginPages");
        console.log("currentToken", token);
        // response token save to cookie
        res
          .cookie("authToken", token)
          .status(200)
          .redirect("http://localhost:4200/home");
      }
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = router;

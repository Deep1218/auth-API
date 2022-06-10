const router = require("express").Router();
const jwt = require("jsonwebtoken");

const auth = require("../Helper/commanMiddleware");
const User = require("../../model/users");
const googleRoutes = require("../Auth/middleware");

// auth login
router.post("/login", async (req, res) => {
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
      if (error) {
        throw new Error(error);
      }
      // console.log(res);
      res
        .clearCookie("authToken")
        .clearCookie("error")
        .status(200)
        .send({ status: "Success", message: "Logged out" });
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: "failed", message: error });
  }
});

// auth create user
router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    const token = jwt.sign({ _id: user._id.toString() }, "loginPages");
    if (token) {
      await user.save();
    }
    // console.log(user);
    //TODO Add send mail verfication
    res
      .cookie("authToken", token)
      .status(200)
      .send({ status: "Success", message: "successfully registered" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: "failed", message: error });
  }
});

router.use("/google", googleRoutes);

//auth get user
router.get("/user", auth, async (req, res) => {
  try {
    console.log("working");
    res
      .status(200)
      .send({ status: "Success", message: "successfully", user: req._user });
  } catch (error) {
    res.status(400).send({ status: "failed", message: error });
  }
});
module.exports = router;

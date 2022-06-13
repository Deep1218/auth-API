const router = require("express").Router();

const { getAuthToken, setMailData, getResetToken } = require("./uitils");
const { transporter } = require("../../config/mailer-config");

const auth = require("../Helper/commanMiddleware");
const User = require("../../model/users");
const googleRoutes = require("../Auth/middleware");

// auth login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password,
    );

    const token = getAuthToken(user._id.toString());

    res
      .cookie("authToken", token)
      .status(200)
      .send({ status: "Success", message: "Logged in successfully", user });
  } catch (error) {
    res.status(400).send({ status: "failed", message: error });
  }
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
    await user.save();

    const token = getAuthToken(user._id.toString());
    const verificationToken = getResetToken(user._id, user.email);
    user.tempToken = verificationToken;
    // console.log(user);
    //TODO send verification mail
    await user.save();
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
    res
      .status(200)
      .send({ status: "Success", message: "successfully", user: req._user });
  } catch (error) {
    res.status(400).send({ status: "failed", message: error });
  }
});

router.post("/forgotPassword", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
      registerType: "local",
    });
    // console.log(user);
    if (!user) {
      res.send({ status: "failed", message: "User not found" }); //TODO add status code
    }
    const resetToken = getResetToken(user._id, user.email);
    user.tempToken = resetToken;
    await user.save();
    //TODO send reset password mail
    res
      .status(200)
      .send({ status: "Success", message: "Email sent successfully" });
  } catch (error) {
    res.status(400).send({ status: "failed", message: error });
  }
});
router.post("/resetPassword/:id/:resetToken", async (req, res) => {});
router.patch("/verify/:id/:verificationToken", async (req, res) => {});
module.exports = router;

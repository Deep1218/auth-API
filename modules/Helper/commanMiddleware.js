const jwt = require("jsonwebtoken");
const User = require("../../model/users");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.authToken;
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, "loginPages");
    console.log("Token Decoded", decoded);
    const user = await User.findOne({
      _id: decoded._id,
    });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = auth;

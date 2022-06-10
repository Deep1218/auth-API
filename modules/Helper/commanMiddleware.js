const jwt = require("jsonwebtoken");
const User = require("../../model/users");
const { getCookies } = require("../Auth/uitils");

const auth = async (req, res, next) => {
  try {
    // console.log("Working");
    let localCookies = getCookies(req);
    const token = localCookies.authToken;
    if (!token) {
      throw new Error();
    }
    const decoded = jwt.verify(token, "loginPages");
    // console.log("Token Decoded", decoded);
    const user = await User.findOne({
      _id: decoded._id,
    });

    if (!user) {
      throw new Error();
    }
    req._user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = auth;

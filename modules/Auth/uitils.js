const jwt = require("jsonwebtoken");

//return cookie in json format
const getCookies = (req) => {
  const values = {};
  let cookieArr = req.headers.cookie.split(";");
  cookieArr.forEach((cookie) => {
    let data = cookie.trim().split("=");
    for (let i = 0; i < data.length - 1; i++) {
      values[data[i]] = data[i + 1];
    }
  });
  return values;
};

//return auth token
const getAuthToken = (_id) => {
  return jwt.sign({ _id }, "loginPages");
};

//return reset token
const getResetToken = (userId, userEmail) => {
  return jwt.sign({ _id: userId, email: userEmail }, "loginPages");
};

module.exports = {
  getCookies,
  getAuthToken,
  getResetToken,
};

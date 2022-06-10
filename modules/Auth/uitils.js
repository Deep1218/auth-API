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

module.exports = {
  getCookies,
};

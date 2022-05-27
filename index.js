const express = require("express");
const morgan = require("morgan");
require("./config/db-config");
// require("./config/passport-config");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log("Server is up on port " + port);
});

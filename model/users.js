const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  registerType: {
    type: String,
    default: "local",
  },
  googleId: {
    type: String,
  },
  profile: {
    type: String,
    default: "assets/img/blank-profile.png",
  },
  phoneNo: {
    type: Number,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    require: true,
    default: false,
  },
  tempToken: {
    type: String,
  },
});

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  // delete userObject.tokens;

  return userObject;
};

// Hash the plain text password before saving
userSchema.pre("save", async function (next) {
  const user = this;
  // console.log(user);

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model("user", userSchema);

module.exports = User;

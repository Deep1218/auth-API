const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

const User = require("../model/users");

// strategy for login
passport.use(
  "login-google",
  new GoogleStrategy(
    {
      // options for google strategy
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/loginRedirect",
      passReqToCallback: true,
    },
    (req, accessToken, refreshToken, profile, done) => {
      User.find({ googleId: profile.id }).then((currentUser) => {
        if (currentUser.length != 0) {
          req._user = currentUser;
          done(null, currentUser);
        } else {
          req._error = "User is not registered.";
          done(null, currentUser);
        }
      });
    }
  )
);

// strategy for signup
passport.use(
  "signup-google",
  new GoogleStrategy(
    {
      // options for google strategy
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/signupRedirect",
      passReqToCallback: true,
    },
    (req, accessToken, refreshToken, profile, done) => {
      User.find({ googleId: profile.id }).then((currentUser) => {
        if (currentUser.length != 0) {
          req._error = "User already exixts.";
          done(null, currentUser);
        } else {
          new User({
            name: profile.displayName,
            googleId: profile.id,
            profile: profile._json.picture,
            email: profile.emails[0].value,
            registerType: "google",
          })
            .save()
            .then((newUser) => {
              req._user = newUser;
              done(null, newUser);
            });
        }
      });
    }
  )
);

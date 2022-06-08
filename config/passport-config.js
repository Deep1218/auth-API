const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

const User = require("../model/users");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

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
        if (!currentUser) {
          req.error = "User not registered.";
          done(null, currentUser);
        } else {
          req.user = currentUser;
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
        if (currentUser) {
          req.error = "User already exixts.";
          done(null, currentUser);
        } else {
          new User({
            name: profile.displayName,
            googleId: profile.id,
            profile: profile._json.picture,
            email: profile.emails[0].value,
            registerType: "google",
          })
            .sav()
            .then((newUser) => {
              req.user = newUser;
              done(null, newUser);
            });
        }
      });
    }
  )
);

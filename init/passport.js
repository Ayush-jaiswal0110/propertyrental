// const passport = require("passport");
// //const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const FacebookStrategy = require("passport-facebook").Strategy;
// const User = require("../models/user");

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: process.env.GOOGLE_CALLBACK_URL,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         let user = await User.findOne({ googleId: profile.id });
//         if (!user) {
//           user = new User({
//             username: profile.displayName,
//             email: profile.emails[0].value,
//             googleId: profile.id,
//           });
//           await user.save();
//         }
//         done(null, user);
//       } catch (err) {
//         done(err, null);
//       }
//     }
//   )
// );
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/user"); // Your user model

console.log("FacebookStrategy is being configured...");
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["id", "displayName", "emails"], // Important to fetch email
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Facebook profile:", profile);
      try {
        let user = await User.findOne({ facebookId: profile.id });

        if (!user) {
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : "";
          user = new User({
            username: profile.displayName || "Facebook User",
            email: email,
            facebookId: profile.id,
          });
          await user.save();
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

const GoogleStrategy = require("passport-google-oauth20").Strategy;
console.log("GoogleStrategy is being configured...");
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // Set the Client ID in your .env
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Set the Client Secret in your .env
      callbackURL: "http://localhost:8080/auth/google/callback", // Adjust as needed
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Facebook profile:", profile);
      try {
        const user = await User.findOne({ googleId: profile.id });
        if (!user) {
          const newUser = new User({
            username: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
          });
          await newUser.save();
          return done(null, newUser);
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);


const passport = require('passport'),
  GoogleStrategy = require('passport-google-oauth20').Strategy,
  UserService = require('./services/user-service');

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } =
  process.env;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, cb) => {
      const user = await UserService.findOrCreateFromGoogleProfile(profile);
      cb(undefined, user);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(async function (_id, done) {
  const user = await UserService.findById(_id);
  done(null, user);
});

module.exports = passport;

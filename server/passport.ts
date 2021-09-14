import dotenv from 'dotenv';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import * as UserService from './services/user-service';
dotenv.config();

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } =
  process.env;

passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: GOOGLE_CLIENT_ID as string,
      clientSecret: GOOGLE_CLIENT_SECRET as string,
      callbackURL: GOOGLE_CALLBACK_URL as string,
    },
    async (accessToken, refreshToken, profile, cb) => {
      const user = await UserService.findOrCreateFromGoogleProfile(profile);
      cb(undefined, user);
    }
  )
);

passport.serializeUser(function (user: any, done) {
  done(null, user._id);
});

passport.deserializeUser(async function (_id, done) {
  const user = await UserService.findById(_id);
  done(null, user);
});

export default passport;

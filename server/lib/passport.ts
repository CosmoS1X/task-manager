import passport from 'passport';
import { Strategy } from 'passport-local';
import User from '../models/User';

passport.use(
  'local',
  new Strategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const user = await User.query().findOne({ email });

        if (!user) {
          return done(null, false, { message: 'flash.login.errors.email' });
        }

        const isValidPassword = user.verifyPassword(password);

        if (!isValidPassword) {
          return done(null, false, { message: 'flash.login.errors.password' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.serializeUser((user: User, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await User.query().findById(id);

    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;

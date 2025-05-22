import passport from 'passport';
import { Strategy } from 'passport-local';
import User from '../models/User';

const checkCredentials = async (email: string, password: string) => {
  const user = await User.query().findOne({ email });

  if (!user) return { user: null, message: 'flash.login.errors.email' };

  const isValidPassword = user.verifyPassword(password);

  if (!isValidPassword) return { user: null, message: 'flash.login.errors.password' };

  return { user };
};

const strategy = new Strategy(
  { usernameField: 'email', passwordField: 'password' },
  async (email, password, done) => {
    try {
      const { user, message } = await checkCredentials(email, password);

      if (user) return done(null, user);

      return done(null, false, { message });
    } catch (error) {
      return done(error);
    }
  },
);

passport.use('local', strategy);

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

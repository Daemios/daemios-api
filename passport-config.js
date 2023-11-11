import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import users from './mixins/user';

function init(passport) {
  const authenticateUser = async (email, password, done) => {
    try {
      const user = await users.getUserByEmail(email);
      if (!user) {
        return done(null, false, { message: 'Incorrect email or password' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect email or password' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

  passport.serializeUser((user, done) => done(null, user));

  passport.deserializeUser(async (user, done) => {
    try {
      const foundUser = await users.getUserById(user.user_id);
      done(null, foundUser);
    } catch (err) {
      done(err, null);
    }
  });
}

export default init;

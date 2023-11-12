import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { getUserByEmail, getUserById, hashPassword } from './lib/user.js';

function init(passport) {
  const authenticateUser = async (email, password, done) => {
    try {
      const user = await getUserByEmail(email);
      if (!user) {
        console.log('no user found');
        return done(null, false, { message: 'Incorrect email or password' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('isMatch', isMatch);
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
      const foundUser = await getUserById(user.user_id);
      done(null, foundUser);
    } catch (err) {
      done(err, null);
    }
  });
}

export default init;

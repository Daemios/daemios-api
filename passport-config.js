const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const users = require('./mixins/user');

function init(passport) {
  // used to serialize the user for the session
  const authenticateUser = async (email, password, done) => {
    users.getUserByEmail(email)
      .then((user) => {
        if (!user) {
          return done(null, false, { message: 'Incorrect email or password' });
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            return done(err);
          }
          if (!isMatch) {
            return done(null, false, { message: 'Incorrect email or password' });
          }
          return done(null, user);
        });
      }
    );

  }
  passport.use(new LocalStrategy({
    usernameField: 'email',
  }, authenticateUser));
  passport.serializeUser((user, done) => {
    return done(null, user.user_id);
  });
  passport.deserializeUser(function(id, done) {
    users.getUserById(id).then((user) => {
      done(null, user);
    });
  });
}

module.exports = init;

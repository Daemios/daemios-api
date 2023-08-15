module.exports.isAuth = (req, res, next) => {
  console.log('isAuthenticated: ' + req.isAuthenticated())
  if (req.isAuthenticated()) {
    console.log('isAuthenticated: ' + req.isAuthenticated())
    console.log('req.user: ' + req.user.user_id)
    return next();
  }
  res.redirect('/login');
};

module.exports.isAdmin = (req, res, next) => {
  if (req.user.admin) {
    return next();
  }
  res.status(401).json({
    msg: 'You are not authorized to view this resource'
  });
}
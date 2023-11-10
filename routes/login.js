const passport = require('passport');
const router = require('express').Router();

router.post('/', passport.authenticate('local'), (req, res) => {
  if (req.user) {
    res.send({
      success: true,
      display_name: req.user.display_name,
    });
  }
});

module.exports = router;

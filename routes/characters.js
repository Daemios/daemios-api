const router = require('express').Router();
const pool = require('../mixins/db')
const characters = require('../mixins/characters')

router.get('/selectCharacter', async(req, res, next) => {
  characters.selectCharacter(req, res, next)
});

module.exports = router;
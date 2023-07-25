if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const passport = require('passport');
const logger = require('morgan');
const app = express();
const pool = require("./mixins/db");
const generate = require("./mixins/generate");
const wss = require("./mixins/socket");


app.use(require('cors')({
  // this must be changed for production
  origin: 'http://localhost:8080',
  credentials: true,
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(logger('dev'));
app.use(require('express-session')({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize( { session: true } ));
app.use(passport.session( {
  session: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
  },
  credentials: true
} ));
require('./passport-config')(passport); // This is just abstracting the passport setup into a separate file

app.use('/', require('./routes/index'));
app.use('/user', require('./routes/user'));
app.use('/characters', require('./routes/characters'));
app.use('/inventory', require('./routes/inventory'));
app.use('/ability', require('./routes/ability'));
app.use('/arena', require('./routes/arena'));
app.use('/world', require('./routes/world'));
app.use('/dm', require('./routes/dm'));

// TODO move this somewhere more appropriate
app.locals.arena = {};
pool.getConnection()
  .then(conn => {
    conn.query(`SELECT * FROM arena_history ORDER BY last_active DESC LIMIT 1`)
      .then((single) => {
        app.locals.arena.terrain = generate.arena.simplexTerrain(single[0].size, single[0].seed)
        wss.send('arena', app.locals.arena)
      })
  })

// World stuff
app.locals.world = {
  size: 256,
  seed: 'einstein2',
};
wss.send('world', app.locals.world)

app.listen(3000, () => {
  console.log('Listening for requests')
})



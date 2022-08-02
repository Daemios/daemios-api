if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Authorization, Accept, Cache-Control, Content-Type, X-Organization-Alias");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});
app.use (function (req, res, next) {
  if (req.method !== 'OPTIONS' && false) {
    res.redirect('/login');
  } else {
    next();
  }
});


const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const inventoryRouter = require('./routes/inventory');
const abilityRouter = require('./routes/ability');
const arenaRouter = require('./routes/arena');
const worldRouter = require('./routes/world');
const pool = require("./mixins/db");
const generate = require("./mixins/generate");
const wss = require("./mixins/socket");

const initializePassport = require('./passport-config');
initializePassport(passport);
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}))
app.use(passport.initialize( { session: true } ));
app.use(passport.session( { session: true } ));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/inventory', inventoryRouter);
app.use('/ability', abilityRouter);
app.use('/arena', arenaRouter);
app.use('/world', worldRouter);

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



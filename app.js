require('dotenv').config()
const express = require('express');
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
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const inventoryRouter = require('./routes/inventory');
const abilityRouter = require('./routes/ability');
const arenaRouter = require('./routes/arena');

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/inventory', inventoryRouter);
app.use('/ability', abilityRouter);
app.use('/arena', arenaRouter);

// TODO move this somewhere more appropriate
const generate = require('./mixins/generate')
app.locals.arena = {};
app.locals.arena.terrain = generate.arena.terrain(16, 'test_seed')

app.listen(3000, () => {
  console.log('Listening for requests')
})



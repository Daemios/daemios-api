// Load environment variables if not in production
import dotenv from 'dotenv';

// Import necessary modules
import cors from 'cors';
import express from 'express';
import passport from 'passport';
import logger from 'morgan';
import session from 'express-session';
import MySQLSession from 'express-mysql-session';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}
const MySQLStore = MySQLSession(session); // WebSockets

// Initialize express application
const app = express();

// Configuration options for connecting to MariaDB
const options = {
  host: process.env.db_host, // Host name
  port: 3306, // Port number
  user: process.env.db_user, // User name
  password: process.env.db_password, // Password
  database: process.env.db_database, // Database name
};

// Create a new instance of the MySQLStore with the connection options
const sessionStore = new MySQLStore(options);

// Allow CORS for specified origin
app.use(cors({
  origin: 'http://localhost:8080', // Allowed origin
  credentials: true, // Allow credentials
}));

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }));

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware for logging HTTP requests
app.use(logger('dev'));

// Middleware to handle sessions, using MySQL as the store
app.use(session({
  key: 'session_cookie_name', // Name of the cookie
  secret: process.env.SESSION_SECRET, // Secret key for signing the session ID cookie
  store: sessionStore, // The MySQL session store
  resave: true, // Force session to be saved back to the store
  saveUninitialized: true, // Save uninitialized sessions
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // Set cookie expiration time to 1 day
  },
}));

// Initialize Passport with session support
app.use(passport.initialize({ session: true }));

// Enable persistent login sessions with Passport
app.use(passport.session());

// Import Passport configuration
require('./passport-config')(passport);

// Non-authenticated routes
app.use('/login', require('./routes/login'));

// Middleware to check for authentication
app.use(require('./middleware/auth').isAuth);

// Authenticated routes
app.use('/user', require('./routes/user'));
app.use('/data', require('./routes/data'));
app.use('/inventory', require('./routes/inventory'));
app.use('/ability', require('./routes/ability'));
app.use('/arena', require('./routes/arena'));
app.use('/world', require('./routes/world'));
app.use('/dm', require('./routes/dm'));

app.listen(3000, () => {
  console.log('Listening for requests');
});

// Arena stuff
// TODO move this somewhere more appropriate
/**
app.locals.arena = {};
pool.getConnection()
  .then((conn) => {
    conn.query('SELECT * FROM arena_history ORDER BY last_active DESC LIMIT 1')
      .then((single) => {
        app.locals.arena.terrain = generate.arena.simplexTerrain(single[0].size, single[0].seed);
        wss.send('arena', app.locals.arena);
      });
  });

// World stuff
app.locals.world = {
  size: 256,
  seed: 'einstein2',
};
wss.send('world', app.locals.world);
* */

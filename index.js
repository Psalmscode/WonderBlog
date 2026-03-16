require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const connectDB = require('./server/route/config/db');

const app = express();
const PORT = parseInt(process.env.PORT) || 5000;

// Connect DB
connectDB();

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'WonderBlog-session-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL || process.env.MONGODB_URI,
    ttl: 14 * 24 * 60 * 60
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    httpOnly: true
  }
}));

// View Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Inject user into all views
app.use((req, res, next) => {
  const jwt = require('jsonwebtoken');
  const token = req.cookies.userToken || req.cookies.authToken;
  res.locals.user = null;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'WonderBlog-super-secret-jwt-key');
      res.locals.user = decoded;
      res.locals.user.userType = req.cookies.authToken ? 'admin' : 'user';
    } catch (err) { /* invalid token */ }
  }
  next();
});

// Routes
app.use('/', require('./server/route/main'));
app.use('/', require('./server/route/userRoutes'));
app.use('/admin', require('./server/route/admin'));

const startServer = (port, attempts = 5) => {
  const server = app.listen(port, () =>
    console.log(`\n✦ WonderBlog running → http://localhost:${port}\n`)
  );

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && attempts > 0) {
      const nextPort = port + 1;
      console.warn(`Port ${port} in use, trying ${nextPort}...`);
      setTimeout(() => startServer(nextPort, attempts - 1), 100);
      return;
    }
    console.error('Server error:', err);
    process.exit(1);
  });
};

startServer(PORT);

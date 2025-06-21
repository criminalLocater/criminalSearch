require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./config/db');
const session = require('express-session');
const cors = require('cors');
// cors
app.use(
  cors({
    origin: "http://localhost:5173", // Allow only your frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-access-token", "Authorization"], // Add your headers here
    credentials: true, // If you're using cookies
  })
);

// handling formdata
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(express.json());

// session management
app.use(session({
    secret: 'MyS3CR3T#@!@CGGmn',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
// passport.js initialization
app.use((req, res, next) => {
    let auth = require('./middlewares/auth')(req, res, next)
    app.use(auth.initialize());
    if (req.session.token && req.session.token != null) {
        req.headers['token'] = req.session.token;
    }
    next();
});

// api routes
app.use('/api/user',require('./routes/user.route'))
app.use('/api/criminals', require('./routes/criminal.route'));
app.use('/api/station', require('./routes/station.route'));

// server listen
app.listen(process.env.PORT, async() => {
    console.log(`Server is running on http://127.0.0.1:${process.env.PORT}`);
    await db.connectDB()
});

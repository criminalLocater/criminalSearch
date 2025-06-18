require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./config/db');
const session = require('express-session');

// handling formdata
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 
app.use(session({
    secret: 'MyS3CR3T#@!@CGGmn',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
// 
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

require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./config/db');

// handling formdata
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// api routes
app.use('/api/user',require('./routes/user.route'))
app.use('/api/criminals', require('./routes/criminal.route'));

// server listen
app.listen(process.env.PORT, async() => {
    console.log(`Server is running on http://127.0.0.1:${process.env.PORT}`);
    await db.connectDB()
});

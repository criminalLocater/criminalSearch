const express = require('express');
const db = require('./config/db');
const app = express();
require('dotenv').config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/criminals', require('./routes/criminal.repo'));
app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${process.env.PORT}`);
    db.connectDB()
});

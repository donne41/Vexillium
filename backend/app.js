
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();
const achievementRoutes =
    require('./routes/achievementRoutes');
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const statusCode = err.statusCode || 500;



const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));
app.use('/api/achievements', achievementRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

pool.query('SELECT 1', (err, results) => {
    if (err) {
        console.error('Database test failed:', err);
        return;
    }

    console.log('Database connected:', results);
});

const questionRoutes = require("./routes/questionroutes");
app.use(questionRoutes);

const port = 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.use((err, req, res, next) => {
    console.error(err);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        error: err.message
    });
});



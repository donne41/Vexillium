
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const db = require('./connectionMySQL');

const achievementRoutes = require('./routes/achievementRoutes');
const roomRoutes = require('./routes/roomRoutes');
const questionRoutes = require('./routes/questionRoutes');

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

app.set('io', io);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));

app.use('/api/achievements', achievementRoutes);
app.use('/api/rooms', roomRoutes);
app.use(questionRoutes);

async function testDatabaseConnection() {
    try {
        const [results] = await db.query('SELECT 1');

        console.log('Database connected:', results);
    } catch (error) {
        console.error('Database test failed:', error);
    }
}

testDatabaseConnection();

const port = 3000;

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

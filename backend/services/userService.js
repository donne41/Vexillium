const pool = require('../connectionMySQL');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;
const PUBLIC_COLUMNS = 'id, username, created_at, last_login_at';

async function createUser(username, password, email) {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const [result] = await pool.execute(
        'INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)',
        [username, hash, email]
    );
    return { id: result.insertId, username };
}

async function getAllUsers() {
    const [rows] = await pool.execute(`SELECT ${PUBLIC_COLUMNS} FROM users`);
    return rows;
}

async function getUserById(id) {
    const [rows] = await pool.execute(
        `SELECT ${PUBLIC_COLUMNS} FROM users WHERE id = ?`,
        [id]
    );
    return rows[0] ?? null;
}

async function getUserByUsername(username) {
    const [rows] = await pool.execute(
        `SELECT ${PUBLIC_COLUMNS} FROM users WHERE username = ?`,
        [username]
    );
    return rows[0] ?? null;
}

async function getUserByEmail(email) {
    const [rows] = await pool.execute(
        `SELECT ${PUBLIC_COLUMNS} FROM users WHERE email = ?`,
        [email]
    );
    return rows[0] ?? null;
}

async function updateUser(id, { username, email, password }) {
    const fields = [];
    const values = [];

    if (username) {
        fields.push('username = ?');
        values.push(username);
    }

    if (email) {
        fields.push('email = ?');
        values.push(email);
    }
    
    if (password) {
        fields.push('password_hash = ?');
        values.push(await bcrypt.hash(password, SALT_ROUNDS));
    }

    values.push(id);
    const [result] = await pool.execute(
        `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
        values
    );
    return result.affectedRows > 0;
}

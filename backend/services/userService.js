const pool = require('../connectionMySQL');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;
// Kolumner som ägaren av kontot (och admin) får se. Används bara bakom
// requireOwnerOrAdmin/requireAdmin och visas aldrig publikt.
const ACCOUNT_COLUMNS = 'id, username, email, role, created_at, last_login_at';

async function createUser(username, password, email) {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const [result] = await pool.execute(
        'INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)',
        [username, hash, email]
    );
    return { id: result.insertId, username };
}

async function getAllUsers() {
    const [rows] = await pool.execute(`SELECT ${ACCOUNT_COLUMNS} FROM users`);
    return rows;
}

async function getUserById(id) {
    const [rows] = await pool.execute(
        `SELECT ${ACCOUNT_COLUMNS} FROM users WHERE id = ?`,
        [id]
    );
    return rows[0] ?? null;
}

async function getUserByUsername(username) {
    const [rows] = await pool.execute(
        `SELECT ${ACCOUNT_COLUMNS} FROM users WHERE username = ?`,
        [username]
    );
    return rows[0] ?? null;
}

async function getUserByEmail(email) {
    const [rows] = await pool.execute(
        `SELECT ${ACCOUNT_COLUMNS} FROM users WHERE email = ?`,
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

async function deleteUser(id) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        await connection.execute(
            'SELECT id FROM users WHERE id = ? FOR UPDATE',
            [id]
        );

        await connection.execute(
            `DELETE FROM AccountsRooms
             WHERE RoomID IN (
                 SELECT RoomID FROM Rooms WHERE OwnerUserID = ?
             )`,
            [id]
        );

        await connection.execute(
            `DELETE FROM RoomGuests
             WHERE RoomID IN (
                 SELECT RoomID FROM Rooms WHERE OwnerUserID = ?
             )`,
            [id]
        );

        await connection.execute(
            'DELETE FROM Rooms WHERE OwnerUserID = ?',
            [id]
        );

        const [result] = await connection.execute(
            'DELETE FROM users WHERE id = ?',
            [id]
        );

        await connection.commit();

        return result.affectedRows > 0;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function verifyCurrentPassword(id, currentPassword) {
    if (
        typeof currentPassword !== 'string' ||
        currentPassword.length === 0 ||
        Buffer.byteLength(currentPassword, 'utf8') > 72
    ) {
        return false;
    }

    const [rows] = await pool.execute(
        'SELECT password_hash FROM users WHERE id = ?',
        [id]
    );

    if (rows.length === 0) {
        return false;
    }

    return bcrypt.compare(currentPassword, rows[0].password_hash);
}

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    getUserByUsername,
    getUserByEmail,
    updateUser,
    deleteUser,
    verifyCurrentPassword
};
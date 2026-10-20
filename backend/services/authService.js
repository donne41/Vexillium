const pool = require('../connectionMySQL');
const bcrypt = require('bcryptjs');

/**
 * verifyCredentials verifierar inloggningsuppgifter. identiifier representerar
 * det angivna användarnamnet eller email. Om ett @ används matchas identifier
 * mot användare via email annars användarnamn. Returnerar { id, username }
 * om lösenordet stämmer.
 */
async function verifyCredentials(identifier, password) {
    const column = identifier.includes('@') ? 'email' : 'username';

    const [rows] = await pool.execute(
        `SELECT id, username, password_hash FROM users WHERE ${column} = ?`,
        [identifier]
    );
    const user = rows[0];
    if (!user) {
        return null;
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
        return null;
    }

    return { id: user.id, username: user.username };
}

module.exports = { verifyCredentials };
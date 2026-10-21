const pool = require('../connectionMySQL');
const bcrypt = require('bcryptjs');

// Giltig hash att jämföra mot när användaren saknas, så att svarstiden blir
// densamma oavsett om kontot finns eller inte.
const DUMMY_HASH = bcrypt.hashSync('ingen-anvandare', 10);


/**
 * verifyCredentials verifierar inloggningsuppgifter. identifier representerar
 * det angivna användarnamnet eller email. Om ett @ används matchas identifier
 * mot användare via email annars användarnamn. Returnerar { id, username }
 * om lösenordet stämmer annars null.
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

    const passwordMatches = await bcrypt.compare(password, user ? user.password_hash : DUMMY_HASH);
    if (!user || !passwordMatches) {
        return null;
    }

    return { id: user.id, username: user.username };
}

/**
 * recordLogin anropas vid en lyckad inloggning för att öka login_count med 1
 * och uppdatera last_login_at till nuvarande tid för det angivna användar-id:et.
 */
async function recordLogin(userId) {
    await pool.execute(
        'UPDATE users SET login_count = login_count + 1, last_login_at = NOW() WHERE id = ?',
        [userId]
    );
}

module.exports = { verifyCredentials, recordLogin };
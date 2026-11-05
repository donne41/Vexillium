const pool = require('../connectionMySQL');

// Antal senaste resultat och prestationer som visas på profilen.
const RECENT_LIMIT = 5;

/**
 * getProfileUser hämtar de publika uppgifterna om en användare (aldrig e-post),
 * eller null om användaren saknas.
 */
async function getProfileUser(userId) {
    const [rows] = await pool.execute(
        'SELECT id, username, role, created_at FROM users WHERE id = ?',
        [userId]
    );
    const user = rows[0];
    if (!user) {
        return null;
    }

    return {
        id: user.id,
        username: user.username,
        isAdmin: user.role === 'admin',
        createdAt: user.created_at,
    };
}

/**
 * getRecentResults hämtar användarens senaste quizresultat, nyast först.
 */
async function getRecentResults(userId) {
    const [rows] = await pool.execute(
        `SELECT id, category, score, max_score, completed_at
         FROM game_results
         WHERE user_id = ?
         ORDER BY completed_at DESC, id DESC
         LIMIT ${RECENT_LIMIT}`,
        [userId]
    );

    return rows.map((row) => ({
        id: row.id,
        category: row.category,
        score: row.score,
        maxScore: row.max_score,
        percentage: row.max_score > 0 ? Math.round((row.score / row.max_score) * 100) : 0,
        completedAt: row.completed_at,
    }));
}

/**
 * getCategoryStats summerar användarens resultat per kategori: antal spelade quiz,
 * total poäng och träffsäkerhet (total poäng / total maxpoäng i procent).
 */
async function getCategoryStats(userId) {
    const [rows] = await pool.execute(
        `SELECT category,
                COUNT(*) AS games_played,
                SUM(score) AS total_score,
                SUM(max_score) AS total_max_score
         FROM game_results
         WHERE user_id = ?
         GROUP BY category
         ORDER BY total_score DESC`,
        [userId]
    );

    return rows.map((row) => {
        const totalScore = Number(row.total_score);
        const totalMaxScore = Number(row.total_max_score);

        return {
            category: row.category,
            gamesPlayed: Number(row.games_played),
            totalScore,
            totalMaxScore,
            accuracy: totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0,
        };
    });
}

/**
 * getRecentAchievements hämtar användarens senast upplåsta prestationer, nyast först.
 */
async function getRecentAchievements(userId) {
    const [rows] = await pool.execute(
        `SELECT a.id, a.name, a.description, a.icon, ua.unlocked_at
         FROM user_achievements ua
         JOIN achievements a ON a.id = ua.achievement_id
         WHERE ua.user_id = ?
         ORDER BY ua.unlocked_at DESC, ua.id DESC
         LIMIT ${RECENT_LIMIT}`,
        [userId]
    );

    return rows.map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        icon: row.icon,
        unlockedAt: row.unlocked_at,
    }));
}

module.exports = {
    getProfileUser,
    getRecentResults,
    getCategoryStats,
    getRecentAchievements,
};
const pool = require('../connectionMySQL');


/**/

/**/
async function getLeaderboard({ limit = 10 } = {}) {
    const [rows] = await pool.execute(
        `
        SELECT
            u.id AS id,
            u.username AS username,
            COALESCE(SUM(gr.score), 0) AS score,
            COUNT(gr.id) AS playedMatches
        FROM users u
        LEFT JOIN game_results gr ON gr.user_id = u.id
        GROUP BY u.id, u.username
        ORDER BY score DESC, playedMatches DESC, u.id ASC
        LIMIT ?
        `,
        [limit]
    );

    return rows.map(r => ({
        id: Number(r.id),
        username: r.username,
        score: Number(r.score),
        playedMatches: Number(r.playedMatches)
    }));
}

module.exports = { getLeaderboard };
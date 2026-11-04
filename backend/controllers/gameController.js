exports.completeGame = async (req, res) => {
    try {
        const { category, score, maxScore } = req.body;
        const userId = req.user.id;

        const result = await gameService.completeGame(
            userId,
            category,
            score,
            maxScore
        );

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Kunde inte slutföra spelet'
        });
    }
};

const db = require('../connectionMySQL');

function parseLimit(value, defaultValue = 10) {
    const n = Number(value);
    if (!Number.isInteger(n) || n <= 0) return defaultValue;
    return Math.min(n, 100);
}

exports.getRecentGames = async (req, res) => {
    try {
        const limit = parseLimit(req.query.limit, 10);

        const [rows] = await db.execute(
            `
            SELECT
                gr.id AS id,
                u.username AS username,
                gr.score AS score,
                gr.category AS category,
                gr.completed_at AS completedAt
            FROM game_results gr
            JOIN users u ON u.id = gr.user_id
            ORDER BY gr.completed_at DESC, gr.id DESC
            LIMIT ?
            `,
            [limit]
        );

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Kunde inte hämta senaste spel' });
    }
};

exports.getMyRecentGames = async (req, res) => {
    try {
        const limit = parseLimit(req.query.limit, 10);
        const userId = req.user.id;

        const [rows] = await db.execute(
            `
            SELECT
                gr.id AS id,
                u.username AS username,
                gr.score AS score,
                gr.category AS category,
                gr.completed_at AS completedAt
            FROM game_results gr
            JOIN users u ON u.id = gr.user_id
            WHERE gr.user_id = ?
            ORDER BY gr.completed_at DESC, gr.id DESC
            LIMIT ?
            `,
            [userId, limit]
        );

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Kunde inte hämta dina senaste spel' });
    }
};

const leaderboardService = require('../services/leaderboardService');

function parseLimit(value, defaultValue = 10) {
    const n = Number(value);
    if (!Number.isInteger(n) || n <= 0) return defaultValue;
    return Math.min(n, 100); // enkel maxgräns
}

exports.getLeaderboard = async (req, res) => {
    try {
        const limit = parseLimit(req.query.limit, 10);
        const rows = await leaderboardService.getLeaderboard({ limit });
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ett internt serverfel uppstod' });
    }
};

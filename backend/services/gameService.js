const connectionMySQL = require('../connectionMySQL');
const achievementService = require('./achievementService');

async function completeGame(userId, category, score, maxScore) {
    const result = await saveGameResult(
        userId,
        category,
        score,
        maxScore
    );

    const newAchievements =
        await achievementService.evaluateAchievements(userId, {
            type: 'game_completed',
            category,
            score,
            maxScore
        });

    return {
        result,
        newAchievements
    };
}

async function saveGameResult(userId, category, score, maxScore) {
    const [result] = await connectionMySQL.execute(
        `
        INSERT INTO game_results
            (user_id, category, score, max_score)
        VALUES (?, ?, ?, ?)
        `,
        [userId, category, score, maxScore]
    );

    return {
        id: result.insertId,
        userId,
        category,
        score,
        maxScore
    };
}

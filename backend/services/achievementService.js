const connectionMySQL = require('../connectionMySQL');
const achievementService = require('../services/achievementService');
const LOGIN_FAILED = 'Fel användarnamn, e-post eller lösenord';



async function getAchievements(userId = null) {
    if (!userId) {
        const [rows] = await connectionMySQL.query(
            `
            SELECT
                id,
                code,
                name,
                description,
                icon,
                image,
                trigger_type,
                threshold,
                category,
                false AS unlocked,
                null AS unlocked_at
            FROM achievements
            ORDER BY id
            `
        );

        return rows;
    }

    const [rows] = await connectionMySQL.query(
        `
        SELECT
            a.id,
            a.code,
            a.name,
            a.description,
            a.icon,
            a.image,
            a.trigger_type,
            a.threshold,
            a.category,
            ua.unlocked_at IS NOT NULL AS unlocked,
            ua.unlocked_at
        FROM achievements a
        LEFT JOIN user_achievements ua
            ON ua.achievement_id = a.id
            AND ua.user_id = ?
        ORDER BY a.id
        `,
        [userId]
    );

    return rows;
}

async function getUserAchievements(userId, event) {
    if (!event || !event.type) {
        throw new Error('Event med giltig "type" måste anges');
    }

    const triggerTypesByEvent = {
        login: ['login'],
        game_completed: ['game_completed', 'high_score']
    };

    const triggerTypes = triggerTypesByEvent[event.type];

    if (!triggerTypes) {
        throw new Error(`Unsupported event type: ${event.type}`);
    }

    const [achievements] = await connectionMySQL.query(
        `
            SELECT *
            FROM achievements
            WHERE trigger_type IN (?)
        `,
        [triggerTypes]
    );

    return achievements;
}

async function evaluateAchievements(userId, event) {
    const triggerTypesByEvent = {
        login: ['login'],
        game_completed: ['game_completed', 'high_score']
    };

    const triggerTypes = triggerTypesByEvent[event.type];

    if (!triggerTypes) {
        throw new Error(`Unsupported event type: ${event.type}`);
    }

    const [achievements] = await connectionMySQL.query(
        `
        SELECT *
        FROM achievements
        WHERE trigger_type IN (?)
        `,
        [triggerTypes]
    );

    const unlocked = [];

    for (const achievement of achievements) {
        let qualifies = false;

        if (event.type === 'login') {
            if (achievement.trigger_type === 'login') {
                const [rows] = await connectionMySQL.query(
                    `
                    SELECT login_count
                    FROM users
                    WHERE id = ?
                    `,
                    [userId]
                );

                const loginCount = Number(rows[0]?.login_count ?? 0);

                qualifies =
                    loginCount >= Number(achievement.threshold);
            }

        } else if (event.type === 'game_completed') {

            if (achievement.trigger_type === 'game_completed') {
                let sql = `
                    SELECT COUNT(*) AS completedGames
                    FROM game_results
                    WHERE user_id = ?
                `;

                const params = [userId];

                // NULL betyder att prestationen gäller alla kategorier.
                if (achievement.category !== null) {
                    sql += ' AND category = ?';
                    params.push(achievement.category);
                }

                const [rows] = await connectionMySQL.query(sql, params);

                const completedGames = Number(rows[0].completedGames);

                qualifies =
                    completedGames >= Number(achievement.threshold);

            } else if (achievement.trigger_type === 'high_score') {
                const score = Number(event.score);
                const maxScore = Number(event.maxScore);

                if (
                    Number.isFinite(score) &&
                    Number.isFinite(maxScore) &&
                    maxScore > 0
                ) {
                    const percentage = (score / maxScore) * 100;

                    const categoryMatches =
                        achievement.category === null ||
                        achievement.category === event.category;

                    qualifies =
                        categoryMatches &&
                        percentage >= Number(achievement.threshold);
                }
            }
        }

        if (qualifies) {
            const [result] = await connectionMySQL.query(
                `
                INSERT IGNORE INTO user_achievements
                    (user_id, achievement_id)
                VALUES (?, ?)
                `,
                [userId, achievement.id]
            );

            if (result.affectedRows === 1) {
                unlocked.push(achievement);
            }
        }
    }

    return unlocked;
}


module.exports = {
    getAchievements,
    getUserAchievements,
    evaluateAchievements
};
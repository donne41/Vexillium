const connectionMySQL = require('./../connectionMySQL');



async function getAchievements() {
    const [rows] = await connectionMySQL.query('SELECT * FROM achievements');
    return rows;
}

async function getUserAchievements(userId) {
    const [rows] = await pool.query(
        `
        SELECT
            a.id,
            a.code,
            a.name,
            a.description,
            a.icon,
            a.trigger_type,
            a.threshold,
            a.category,
            ua.unlocked_at
        FROM achievements a
        LEFT JOIN user_achievements ua
            ON ua.achievement_id = a.id
            AND ua.user_id = ?
        `,
        [userId]
    );



    return rows;
}

async function evaluateAchievements(userId, event) {

    const [achievements] = await connectionMySQL.query(
        `
            SELECT *
            FROM achievements
            WHERE trigger_type = ?
        `,
        [event.type]
    );

    const unlocked = [];

    for (const achievement of achievements) {

        let qualifies = false;

        if (event.type === 'login') {

            if (achievement.trigger_type === 'login') {
                currentValue = user.login_count;

            }
        } else if (event.type === 'game_completed') {

            if (achievement.trigger_type === 'game_completed') {
                qualifies = event.category === achievement.category;

            }

            if (achievement.trigger_type === 'high_score') {
                const percentage =
                    (event.score / event.maxScore) * 100;
                qualifies = percentage >= achievement.threshold;

            }

            if (qualifies) {

                unlocked.push(achievement);
            }
        }
    }

    return unlocked;
}


module.exports = {
    getAchievements,
    evaluateAchievements
};

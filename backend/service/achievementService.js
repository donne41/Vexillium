const connectionMySQL = require('./../connectionMySQL');



async function getAchievements() {
    const [rows] = await connectionMySQL.query('SELECT * FROM achievements');
    return rows;
}

async function getUserAchievements(userId) {
    const [rows] = await connectionMySQL.query(
        'SELECT * FROM user_achievements WHERE user_id = ?',
        [userId]
    );
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

    return achievements;
}


module.exports = {
    getAchievements,
    evaluateAchievements
};

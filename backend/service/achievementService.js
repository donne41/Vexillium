const connectionMySQL = require('./../connectionMySQL');



async function getAchievements() {
    const [rows] = await connectionMySQL.query('SELECT * FROM achievements');
    return rows;
}

async function evaluateAchievements(userId, event) {

    return [];
}


module.exports = {
    getAchievements,
    evaluateAchievements
};

const achievementService = require("../service/achievementService");


exports.getAchievements = async (req, res) => {
    try {
        const achievements = await achievementService.getAchievements();

        res.json(achievements);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Could not fetch achievements'
        });
    }
};







const achievementService = require("../services/achievementService");


exports.getAchievements = async (req, res) => {
    try {
        const userId = req.user?.id ?? null;
        const achievements = await achievementService.getAchievements(userId);

        res.json(achievements);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Kunde inte hämta prestationerna'
        });
    }
};









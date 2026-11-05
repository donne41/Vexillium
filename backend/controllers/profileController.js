const profileService = require('../services/profileService');

/**
 * getProfile skickar en användares publika profil: uppgifter, senaste resultat,
 * statistik per kategori och senaste prestationer. Kräver ingen inloggning.
 */
exports.getProfile = async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'Ogiltigt användar-ID' });
    }

    try {
        const user = await profileService.getProfileUser(id);
        if (!user) {
            return res.status(404).json({ error: 'Användaren hittades inte' });
        }

        const [recentResults, categoryStats, recentAchievements] = await Promise.all([
            profileService.getRecentResults(id),
            profileService.getCategoryStats(id),
            profileService.getRecentAchievements(id),
        ]);

        res.json({ user, recentResults, categoryStats, recentAchievements });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ett internt serverfel uppstod' });
    }
};
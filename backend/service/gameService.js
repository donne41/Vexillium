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
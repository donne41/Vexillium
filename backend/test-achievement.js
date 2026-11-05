const {
    evaluateAchievements
} = require('./services/achievementService.js');

async function main() {
    const userId = 4; // Byt till test123:s faktiska ID

    const unlocked = await evaluateAchievements(userId, {
        category: 'capitals',
        score: 10,
        maxScore: 10,
        type: 'game_completed'
    });

    console.log(
        'Nya prestationer:',
        unlocked.map(achievement => achievement.code)
    );

    process.exit(0);
}

main().catch(error => {
    console.error('Testet misslyckades:', error);
    process.exit(1);
});
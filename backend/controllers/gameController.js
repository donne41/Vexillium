exports.completeGame = async (req, res) => {
    try {
        const { category, score, maxScore } = req.body;
        const userId = req.user.id;

        const result = await gameService.completeGame(
            userId,
            category,
            score,
            maxScore
        );

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Kunde inte slutföra spelet'
        });
    }
};
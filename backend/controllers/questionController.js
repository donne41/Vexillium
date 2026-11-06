const questionService = require("../services/questionService");


exports.getRandomCountries = (async (req, res) => {
    const regions = req.query.regions;
    const filter = req.query.filter || 0
    const category = req.query.category || "flags";
    try {
        const countries = await questionService.getRandom(
            regions,
            filter,
            category
        );
        res.send(countries);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Kunde inte hämta slumpmässiga länder'
        });
    }
});

exports.getRegions = (async (req, res) => {
    try {
        const regions = await questionService.getRegions();
        res.send(regions);
    } catch(error){
        console.error(error);
        return res.status(500).json({
            error: 'Kunde inte hämta regionerna'
        });
    }
})

exports.postQuestions = (async (req, res) => {
    const body = req.body;
    try {
        const saved = await questionService.saveQuestions(body);
        res.status(201).json({ message: 'Frågorna har sparats', saved });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Kunde inte spara frågorna'
        });
    }

})

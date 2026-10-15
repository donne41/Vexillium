const questionService = require("../services/questionService");



exports.getCountries = (async (req, res) => {
    try {
        console.log("Question controller calling for questions");
        const countries = await questionService.getCountries();
        res.json({ countries });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
});

exports.getRandomCountries = (async (req, res) => {
    const regions = req.query.regions;
    try {
        const countries = await questionService.getRandom(regions);
        res.send(countries);
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
});

exports.getRandomAllCountries = (async (req, res) => {
    try {
        const countries = await questionService.getRandomAllCountries();
        res.send(countries);
    }catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
});

exports.getRegions = (async (req, res) => {
    try {
        const regions = await questionService.getRegions();
        res.send(regions);
    }catch(error){
        return res.status(500).json({
            error: error.message
        });
    }
})

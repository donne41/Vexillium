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

exports.getCountriesByRegion = (async (req, res) => {
    const regionId = req.params.regionId;
    try {
        console.log("qController calling region: " + regionId);
        const countries = await questionService.getCountriesByRegion(regionId);
        res.json({ countries });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
});

exports.getRandomCountries = (async (req, res) => {
    const regionId = req.params.regionId;
    try {
        const countries = await questionService.getRandom(regionId);
        res.json({ countries });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
});

exports.getRandomAllCountries = (async (req, res) => {
    try {
        const countries = await questionService.getRandomAllCountries();
        res.json({ countries });
    }catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
});

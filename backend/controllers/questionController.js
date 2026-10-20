const questionService = require("../services/questionService");


exports.getRandomCountries = (async (req, res) => {
    const regions = req.query.regions;
    try {
        const countries = await questionService.getRandom(regions);
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

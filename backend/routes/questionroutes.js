const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");

router.get("/api/countries", questionController.getCountries);
router.get("/api/countries/:regionId", questionController.getCountriesByRegion);
router.get("/api/random/:regionId", questionController.getRandomCountries);
router.get("/api/random", questionController.getRandomAllCountries);
router.get("/api/regions", questionController.getRegions);


module.exports = router;
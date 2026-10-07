const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");

router.get("/api/countries", questionController.getCountries);
router.get("/api/countries/:regionId", questionController.getCountriesByRegion);
router.get("/api/random/:regionId", questionController.getRandomCountries);
router.get("/api/random", questionController.getRandomAllCountries);

module.exports = router;
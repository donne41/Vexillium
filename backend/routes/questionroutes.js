const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");

router.get("/api/countries", questionController.getCountries);
router.get("/api/random", questionController.getRandomCountries);
router.get("/api/regions", questionController.getRegions);


module.exports = router;
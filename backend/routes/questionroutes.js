const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");

router.get("/api/countries", questionController.getCountries);
router.get("/api/countries/:regionId", questionController.getCountriesByRegion);


module.exports = router;
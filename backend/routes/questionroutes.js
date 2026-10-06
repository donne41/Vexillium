const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");

router.get("/api/countries", questionController.getCountries);


module.exports = router;
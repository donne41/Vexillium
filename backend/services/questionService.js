const dbConnect = require("../dbConnection");

function getCountries() {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM Countries";
        dbConnect.query(sql, (error, rows) => {
            if (error)
                reject(error);
            else
                resolve(rows);

        });
    });
}

function getCountriesByRegion(regionId) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM Countries WHERE RegionID = ?";
        dbConnect.query(sql, [regionId], (error, rows) => {
            if (error)
                reject(error);
            else
                resolve(rows);
        });
    });
}

function getRandom(regionId) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM Countries WHERE RegionID = ? ORDER BY RAND() LIMIT 4";
        dbConnect.query(sql, [regionId], (error, rows) => {
            if (error)
                reject(error);
            else {
                let quizContent = {
                    "correctIndex": Math.floor(Math.random() * 4),
                    "countries": [rows]
                }
                resolve(quizContent);
            }
        });
    });
}

function getRandomAllCountries() {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM Countries ORDER BY RAND() LIMIT 4";
        dbConnect.query(sql, (error, rows) => {
            if (error)
                reject(error);
            else{
                let quizContent = {
                    "correctIndex": Math.floor(Math.random() * 4),
                    "countries": [rows]
                }
                resolve(quizContent);
            }
        });
    })
}

module.exports = {
    getCountries,
    getCountriesByRegion,
    getRandom,
    getRandomAllCountries,



}
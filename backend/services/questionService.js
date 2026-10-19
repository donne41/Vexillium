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

function getRandom(regions) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM Countries";
        let params = [] 
        if(regions){
            const regionsParam = regions.split(',')
            if(regionsParam.includes("2") && !regionsParam.includes("1")) regionsParam.push("1")
            const placeholders = regionsParam.map(() => '?').join(',')  

            sql +=  ` WHERE RegionID IN (${placeholders})`
            params = regionsParam
        }
        sql += " ORDER BY RAND() LIMIT 4"
        dbConnect.query(sql, params, (error, rows) => {
            if (error)
                reject(error);
            else {
                let quizContent = {
                    "correctIndex": Math.floor(Math.random() * 4),
                    "countries": rows
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
                    "correctIndex": Math.floor(Math.random() * rows.length),
                    "countries": rows
                }
                resolve(quizContent);
            }
        });
    })
}

function getRegions(){
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Regions"
        dbConnect.query(sql, (error, rows) => {
            if(error)
                reject(error)
            else{
                resolve(rows)
            }
        })
    })
}

module.exports = {
    getCountries,
    getCountriesByRegion,
    getRandom,
    getRandomAllCountries,
    getRegions,
    



}
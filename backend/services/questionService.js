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
            if(error)
                reject(error);
            else
                resolve(rows);
        })
    })
}

module.exports = {
    getCountries,
    getCountriesByRegion,
    
}
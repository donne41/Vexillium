const dbConnect = require("../connectionMySQL");


async function getRandom(regions) {
    let sql = "SELECT * FROM Countries";
    let params = []
    if (regions) {
        const regionsParam = regions.split(',')
        if (regionsParam.includes("2") && !regionsParam.includes("1")) regionsParam.push("1")
        const placeholders = regionsParam.map(() => '?').join(',')

        sql += ` WHERE RegionID IN (${placeholders})`
        params = regionsParam
    }
    sql += " ORDER BY RAND() LIMIT 4"
    const [rows] = await dbConnect.query(sql, params)
    return {
        "correctIndex": Math.floor(Math.random() * 4),
        "countries": rows
    }
}


async function getRegions() {
    const sql = "SELECT * FROM Regions"
    const [rows] = await dbConnect.query(sql)
    return rows
}

module.exports = {
    getRandom,
    getRegions,

}
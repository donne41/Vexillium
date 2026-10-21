const dbConnect = require("../connectionMySQL");


async function getRandom(regions, filter) {
    let sql = "SELECT * FROM Countries";
    let regionParams = []
    let filterParams = []
    if (regions) {
        const regionsParam = regions.split(',')
        if (regionsParam.includes("2") && !regionsParam.includes("1")) regionsParam.push("1")

        sql += ` WHERE RegionID IN (?)`
        regionParams = regionsParam
    }
    if (filter !== 0) {
        const filterParam = filter.split(',')
        const placeholders = filterParam.map(() => '?').join(',')

        sql += ` AND NOT CountryID IN (?)`
        filterParams = filterParam
    }
    sql += " ORDER BY RAND() LIMIT 4"
    console.log(sql)
    const [rows] = await dbConnect.query(sql, [regionParams, filterParams])
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
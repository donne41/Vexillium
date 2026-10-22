const dbConnect = require("../connectionMySQL");


async function getRandom(regions, filter) {
    const { sql, params } = buildSqlParams(regions, filter)
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

function buildSqlParams(regions, filter){
    let sql = "SELECT * FROM Countries";
    const params = []
    if (regions) {
        params.push(regions.split(','))
        if (regionsParam.includes("2") && !regionsParam.includes("1")) regionsParam.push("1")

        sql += ` WHERE RegionID IN (?)`
    }
    
    if (filter !== 0) {
        params.push(filter.split(','))

        sql += regions
            ? ' AND CountryID NOT IN (?)'
            : ' WHERE CountryID NOT IN (?)'
    }
    sql += " ORDER BY RAND() LIMIT 4"

    if (regions) {
        params.push(regionParams)
    }

    if (filter !== 0) {
        params.push(filterParams)
    }

    return {
        sql: sql,
        params: params
    }
}

module.exports = {
    getRandom,
    getRegions,

}
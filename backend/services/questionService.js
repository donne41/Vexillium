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
        let regionFilter = []
        regionFilter = regions.split(',')
        if (regions.includes("2") && !regions.includes("1")) regionFilter.push("1")

        sql += ` WHERE RegionID IN (?)`
        params.push(regionFilter)
    }

    if (filter !== 0) {
        params.push(filter.split(','))

        sql += regions
            ? ' AND CountryID NOT IN (?)'
            : ' WHERE CountryID NOT IN (?)'
    }
    sql += " ORDER BY RAND() LIMIT 4"

    return {
        sql: sql,
        params: params
    }
}

module.exports = {
    getRandom,
    getRegions,

}
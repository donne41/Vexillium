const dbConnect = require("../connectionMySQL");

async function getRandom(regions, filter, category) {
    if (category === "neighbours") {
        return getNeighbourQuestion(regions, filter);
    }

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

async function getNeighbourQuestion(regions, filter) {
    const [countries] = await dbConnect.query(
        `SELECT
             Countries.CountryID,
             Countries.Countryname,
             Countries.RegionID,
             CountryNeighbours.Neighbours
         FROM Countries
         JOIN CountryNeighbours
             ON Countries.CountryID = CountryNeighbours.CountryID`
    );

    if (countries.length !== 198) {
        throw new Error("Kör importen av grannländer först")
    }

    for (const country of countries) {
        if (typeof country.Neighbours === "string") {
            country.Neighbours = JSON.parse(country.Neighbours);
        }
    }

    let selectedCountries = countries;

    if (regions) {
        const regionIds = regions.split(",").map(Number);

        if (regionIds.includes(2) && !regionIds.includes(1)) {
            regionIds.push(1);
        }

        selectedCountries = countries.filter(function (country) {
            return regionIds.includes(country.RegionID);
        });
    }

    if (selectedCountries.length === 0) {
        throw new Error("Det finns inga länder i den valda regionen.");
    }

    if (filter) {
        const previousIds = String(filter).split(",").map(Number);

        const newCountries = selectedCountries.filter(function (country) {
            return !previousIds.includes(country.CountryID);
        });

        if (newCountries.length > 0) {
            selectedCountries = newCountries;
        }
    }

    const randomIndex = Math.floor(
        Math.random() * selectedCountries.length
    );

    const questionCountry = selectedCountries[randomIndex];

    const neighbours = countries.filter(function (country) {
        return questionCountry.Neighbours.includes(country.CountryID);
    });

    const answers = [
        {
            CountryID: questionCountry.CountryID,
            Countryname: "Inget av dessa länder"
        }
    ];

    let correctAnswer = "Inget av dessa länder";

    if (neighbours.length > 0) {
        const neighbourIndex = Math.floor(
            Math.random() * neighbours.length
        );

        correctAnswer = neighbours[neighbourIndex].Countryname;

        answers.push({
            CountryID: questionCountry.CountryID,
            Countryname: correctAnswer
        });
    }

    const wrongCountries = countries.filter(function (country) {
        return (
            country.CountryID !== questionCountry.CountryID &&
            !questionCountry.Neighbours.includes(country.CountryID)
        );
    });

    while (answers.length < 4) {
        const index = Math.floor(
            Math.random() * wrongCountries.length
        );

        const wrongCountry = wrongCountries.splice(index, 1)[0];

        answers.push({
            CountryID: wrongCountry.CountryID,
            Countryname: wrongCountry.Countryname
        });
    }

    for (let i = answers.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        const temporaryAnswer = answers[i];
        answers[i] = answers[randomIndex];
        answers[randomIndex] = temporaryAnswer;
    }

    const correctIndex = answers.findIndex(function (answer) {
        return answer.Countryname === correctAnswer;
    });

    let explanation;

    if (neighbours.length > 0) {
        const neighbourNames = neighbours.map(function (country) {
            return country.Countryname;
        });

        explanation =
            "Landgrannar i quizets urval: " +
            neighbourNames.join(", ") +
            ".";
    } else {
        explanation =
            questionCountry.Countryname +
            " har ingen landgranne bland quizets 198 poster.";
    }

    return {
        correctIndex: correctIndex,
        countries: answers,
        prompt:
            "Vilket av dessa länder eller territorier har landgräns mot " +
            questionCountry.Countryname +
            "?",
        explanation: explanation
    };
}

module.exports = {
    getRandom,
    getRegions,

}
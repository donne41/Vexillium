const dbConnect = require("../connectionMySQL");

async function getRandom(regions, filter, category) {
    if (category === "neighbours") {
        return getNeighbourQuestion(regions, filter);
    }

    if (category === "population" || category === "area") {
        return getStatisticsQuestion(regions, filter, category);
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

async function getStatisticsQuestion(regions, filter, category) {
    const [countries] = await dbConnect.query(
        `SELECT
             Countries.CountryID,
             Countries.Countryname,
             Countries.RegionID,
             CountryStatistics.Population,
             CountryStatistics.PopulationYear,
             CountryStatistics.PopulationSource,
             CountryStatistics.AreaKm2,
             CountryStatistics.AreaSource
         FROM Countries
         JOIN CountryStatistics
             ON Countries.CountryID = CountryStatistics.CountryID`
    );

    if (countries.length !== 198) {
        throw new Error(
            "Lägg in befolkning och yta för alla 198 länder först."
        );
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
        throw new Error(
            "Det finns inga länder i den valda regionen."
        );
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

    const countryIndex = Math.floor(
        Math.random() * selectedCountries.length
    );

    const questionCountry = selectedCountries[countryIndex];

    let value;
    let unit;
    let prompt;
    let source;

    if (category === "population") {
        value = Number(questionCountry.Population);
        unit = "invånare";
        source = questionCountry.PopulationSource;

        prompt =
            "Ungefär hur många invånare hade " +
            questionCountry.Countryname +
            " år " +
            questionCountry.PopulationYear +
            "?";
    } else {
        value = Number(questionCountry.AreaKm2);
        unit = "km²";
        source = questionCountry.AreaSource;

        prompt =
            "Ungefär hur stor yta har " +
            questionCountry.Countryname +
            "?";
    }

    if (!Number.isFinite(value) || value <= 0) {
        throw new Error(
            "Ogiltig statistik för " + questionCountry.Countryname
        );
    }

    const roundedValue = Number(value.toPrecision(2));

    const correctAnswer =
        roundedValue.toLocaleString("sv-SE") +
        " " +
        unit;

    const wrongAnswers = [];

    const multipliers = [0.25, 0.5, 0.75, 1.5, 2, 3];

    for (const multiplier of multipliers) {
        const wrongValue = Number(
            (roundedValue * multiplier).toPrecision(2)
        );

        const wrongAnswer =
            wrongValue.toLocaleString("sv-SE") +
            " " +
            unit;

        if (
            wrongAnswer !== correctAnswer &&
            !wrongAnswers.includes(wrongAnswer)
        ) {
            wrongAnswers.push(wrongAnswer);
        }
    }

    if (wrongAnswers.length < 3) {
        throw new Error(
            "Kunde inte skapa tillräckligt många svarsalternativ."
        );
    }

    const answers = [];

    while (answers.length < 3) {
        const index = Math.floor(
            Math.random() * wrongAnswers.length
        );

        const wrongAnswer = wrongAnswers.splice(index, 1)[0];

        answers.push({
            CountryID: questionCountry.CountryID,
            Countryname: wrongAnswer
        });
    }

    const correctIndex = Math.floor(Math.random() * 4);

    answers.splice(correctIndex, 0, {
        CountryID: questionCountry.CountryID,
        Countryname: correctAnswer
    });

    return {
        correctIndex: correctIndex,
        countries: answers,
        prompt: prompt,
        explanation:
            "Uppgiften i databasen är " +
            value.toLocaleString("sv-SE") +
            " " +
            unit +
            ". Källa: " +
            source +
            "."
    };
}

module.exports = {
    getRandom,
    getRegions,

}
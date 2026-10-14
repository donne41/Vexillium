const userService = require('../services/userService');

// ---------- Validation helpers ----------

// Regex för att kolla om en email är korrekt formaterad.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/*
isValidUsername kollar om ett användarnamn är längre än 3 tecken och mindre än
50 tecken för att inte överstiga varchar(50) begränsningen från sql databasen.
*/
function isValidUsername(username) {
    return typeof username === 'string'
        && username.trim().length >= 3
        && username.trim().length <= 50;
}

/*
isValidPassword kollar lösenordet är minst 8 tecken och inte överstiger antalet bytes som bcrypt
läser av (72) med hänsyn till svenska tecken (å, ä, ö) som tar upp 2 bytes istället för 1.
*/
function isValidPassword(password) {
    return typeof password === 'string'
        && password.length >= 8
        && Buffer.byteLength(password, 'utf8') <= 72;
}

/*
isValidEmail kollar att en email inte överstiger varchar(255) begränsningen från databasen
och följer formateringen på en email vilket samtidigt testar att emailen inte är för kort.
 */
function isValidEmail(email) {
    return typeof email === 'string'
        && email.trim().length <= 255
        && EMAIL_PATTERN.test(email.trim());
}

/*
parseId testar att ett angivet id är ett positivt heltal annars returneras null.
 */
function parseId(req) {
    const id = Number(req.params.id);
    return Number.isInteger(id) && id > 0 ? id : null;
}

/*
handleError hanterar errors från mysql är UNIQUE regeln bryts eller ett
internal server error uppstår och skickar då en numrerad status tillbaka.
 */
function handleError(res, error) {
    if (error.code === 'ER_DUP_ENTRY') {
        const field = error.sqlMessage.endsWith("email'") ? 'Email' : 'Username';
        return res.status(409).json({ error: `${field} is already taken` });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
}
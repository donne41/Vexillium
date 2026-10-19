const userService = require('../services/userService');

// ---------- Validation helpers ----------

// Regex för att kolla om en email är korrekt formaterad.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

/**
 * isValidUsername kollar om ett användarnamn är längre än 3 tecken och högst 50
 * tecken för att inte överstiga varchar(50) begränsningen från sql databasen.
*/
function isValidUsername(username) {
    return typeof username === 'string'
        && username.trim().length >= 3
        && username.trim().length <= 50;
}

/**
 * isValidPassword testar att lösenordet är minst 8 tecken och inte överstiger antalet bytes som
 * bcrypt läser av (72) med hänsyn till svenska tecken (å, ä, ö) som tar upp 2 bytes istället för 1.
*/
function isValidPassword(password) {
    return typeof password === 'string'
        && password.length >= 8
        && Buffer.byteLength(password, 'utf8') <= 72;
}

/**
 * isValidEmail kollar att en email inte överstiger varchar(255) begränsningen från databasen
 * och följer formateringen på en email vilket samtidigt testar att emailen inte är för kort.
 */
function isValidEmail(email) {
    return typeof email === 'string'
        && email.trim().length <= 255
        && EMAIL_PATTERN.test(email.trim());
}

/**
 * parseId testar att ett angivet id är ett positivt heltal annars returneras null.
 */
function parseId(req) {
    const id = Number(req.params.id);
    return Number.isInteger(id) && id > 0 ? id : null;
}

/**
 * handleError skickar 409 om en UNIQUE-regel bryts (användarnamn eller email upptaget).
 * Alla andra fel loggas i terminalen och klienten får 500 utan tekniska detaljer.
 */
function handleError(res, error) {
    if (error.code === 'ER_DUP_ENTRY') {
        const field = error.sqlMessage.endsWith("email'")
        ? 'E-postadressen'
            : "Användarnamnet";

        return res.status(409).json({
            error:`${field} är redan upptaget`
        });
    }
    console.error(error);
    return res.status(500).json({ error: 'Ett internt serverfel uppstod' });
}

// ---------- CREATE ----------

/**
 * createUser testar användarnamn, lösenord och email med hjälp av valideringsmetoderna
 * och om alla valideras skapas en ny användare via service metoden annars skickas
 * status meddelanden till klienten.
 */
exports.createUser = async (req, res) => {
    const { username, password, email } = req.body ?? {};

    if (!isValidUsername(username)) {
        return res.status(400).json({ error: 'Användarnamnet måste vara mellan 3 och 50 tecken' });
    }
    if (!isValidPassword(password)) {
        return res.status(400).json({ error: 'Lösenordet måste vara minst 8 tecken och högst 72 byte' });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'En giltig e-postadress krävs' });
    }

    try {
        const user = await userService.createUser(username.trim(), password, email.trim());
        res.status(201).json(user);
    } catch (error) {
        handleError(res, error);
    }
};

// ---------- READ ----------

/**
 * getAllUsers skickar en JSON-array med användar-objekt till klienten,
 * hittas inga användare är listan tom.
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * getUserById hämtar en användare via ID och skickar ett JSON-objekt till klienten,
 * om ID:et inte är korrekt formaterat eller om ingen användare hittas skickas unika
 * felmeddelanden för respektive till klienten.
 */
exports.getUserById = async (req, res) => {
    const id = parseId(req);
    if (!id) {
        return res.status(400).json({ error: 'Ogiltigt användar-ID' });
    }

    try {
        const user = await userService.getUserById(id);
        if (!user) {
            return res.status(404).json({ error: 'Användaren hittades inte' });
        }
        res.json(user);
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * getUserByUsername hämtar en användare via användarnamn och skickar ett
 * JSON-objekt till klienten, om användarnamnet inte hittas i databasen
 * skickas ett felmeddelande till klienten.
 */
exports.getUserByUsername = async (req, res) => {
    try {
        const user = await userService.getUserByUsername(req.params.username);
        if (!user) {
            return res.status(404).json({ error: 'Användaren hittades inte' });
        }
        res.json(user);
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * getUserByEmail hämtar en användare via email och skickar en
 * JSON-array till klienten, om emailen inte hittas i databasen
 * skickas ett felmeddelande till klienten.
 */
exports.getUserByEmail = async (req, res) => {
    try {
        const user = await userService.getUserByEmail(req.params.email);
        if (!user) {
            return res.status(404).json({ error: 'Användaren hittades inte' });
        }
        res.json(user);
    } catch (error) {
        handleError(res, error);
    }
};

// ---------- UPDATE ----------

/**
 * updateUser validerar de fält som skickats med (användarnamn, email och/eller lösenord)
 * och uppdaterar användaren med angivet id. Finns ingen användare med id:t skickas 404.
 * Vid lyckad uppdatering skickas den uppdaterade användaren tillbaka som ett JSON-objekt.
 */
exports.updateUser = async (req, res) => {
    const id = parseId(req);
    if (!id) {
        return res.status(400).json({ error: 'Ogiltigt användar-ID' });
    }

    const { username, email, password } = req.body ?? {};

    if (username === undefined && email === undefined && password === undefined) {
        return res.status(400).json({ error: 'Ange användarnamn, e-post och/eller lösenord' });
    }
    if (username !== undefined && !isValidUsername(username)) {
        return res.status(400).json({ error: 'Användarnamnet måste vara mellan 3 och 50 tecken' });
    }
    if (email !== undefined && !isValidEmail(email)) {
        return res.status(400).json({ error: 'E-postadressen är ogiltig' });
    }
    if (password !== undefined && !isValidPassword(password)) {
        return res.status(400).json({ error: 'Lösenordet måste vara minst 8 tecken och högst 72 byte' });
    }

    try {
        const updated = await userService.updateUser(id, {
            username: username?.trim(),
            email: email?.trim(),
            password
        });
        if (!updated) {
            return res.status(404).json({ error: 'Användaren hittades inte' });
        }
        const user = await userService.getUserById(id);
        res.json(user);
    } catch (error) {
        handleError(res, error);
    }
};

// ---------- DELETE ----------

/**
 * deleteUser raderar en användare från databasen med service metoden
 * om det givna ID:et är korrekt formaterat och användaren existerar.
 * Användarens rader i game_results och user_achievements raderas
 * automatiskt (ON DELETE CASCADE).
 */
exports.deleteUser = async (req, res) => {
    const id = parseId(req);
    if (!id) {
        return res.status(400).json({ error: 'Ogiltigt användar-ID' });
    }

    try {
        const deleted = await userService.deleteUser(id);
        if (!deleted) {
            return res.status(404).json({ error: 'Användaren hittades inte' });
        }
        res.status(204).send();
    } catch (error) {
        handleError(res, error);
    }
};
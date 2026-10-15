const userService = require('../services/userService');

// ---------- Validation helpers ----------

// Regex för att kolla om en email är korrekt formaterad.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

/**
 * isValidUsername kollar om ett användarnamn är längre än 3 tecken och mindre än
 * 50 tecken för att inte överstiga varchar(50) begränsningen från sql databasen.
**/
function isValidUsername(username) {
    return typeof username === 'string'
        && username.trim().length >= 3
        && username.trim().length <= 50;
}

/**
 * isValidPassword kollar lösenordet är minst 8 tecken och inte överstiger antalet bytes som bcrypt
 * läser av (72) med hänsyn till svenska tecken (å, ä, ö) som tar upp 2 bytes istället för 1.
**/
function isValidPassword(password) {
    return typeof password === 'string'
        && password.length >= 8
        && Buffer.byteLength(password, 'utf8') <= 72;
}

/**
 * isValidEmail kollar att en email inte överstiger varchar(255) begränsningen från databasen
 * och följer formateringen på en email vilket samtidigt testar att emailen inte är för kort.
 **/
function isValidEmail(email) {
    return typeof email === 'string'
        && email.trim().length <= 255
        && EMAIL_PATTERN.test(email.trim());
}

/**
 * parseId testar att ett angivet id är ett positivt heltal annars returneras null.
 **/
function parseId(req) {
    const id = Number(req.params.id);
    return Number.isInteger(id) && id > 0 ? id : null;
}

/**
 * handleError hanterar errors från mysql är UNIQUE regeln bryts eller ett
 * internal server error uppstår och skickar då en numrerad status tillbaka.
 **/
function handleError(res, error) {
    if (error.code === 'ER_DUP_ENTRY') {
        const field = error.sqlMessage.endsWith("email'") ? 'Email' : 'Username';
        return res.status(409).json({ error: `${field} is already taken` });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
}

// ---------- CREATE ----------

/**
 * createUser testar användarnamn, lösenord and email med hjälp av valideringsmetoderna
 * och om alla valideras skapas en nya användare via service metoden annars skickas
 * status meddelanden till klienten.
 **/
exports.createUser = async (req, res) => {
    const { username, password, email } = req.body ?? {};

    if (!isValidUsername(username)) {
        return res.status(400).json({ error: 'Username must be 3–50 characters' });
    }
    if (!isValidPassword(password)) {
        return res.status(400).json({ error: 'Password must be at least 8 characters (max 72 bytes)' });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'A valid email is required' });
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
 **/
exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * getUserById hämtar en användare via ID och skickar en JSON-array till klienten,
 * om ID:et inte är korrekt formaterat eller om ingen användare hittas skickas unika
 * felmeddelanden för respektive till klienten.
 **/
exports.getUserById = async (req, res) => {
    const id = parseId(req);
    if (!id) {
        return res.status(400).json({ error: 'Invalid user id' });
    }

    try {
        const user = await userService.getUserById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * getUserByUsername hämtar en användare via användarnamn och skickar en
 * JSON-array till klienten, om användarnamnet inte hittas i databasen
 * skickas ett felmeddelande till klienten.
 **/
exports.getUserByUsername = async (req, res) => {
    try {
        const user = await userService.getUserByUsername(req.params.username);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * getUserByUsername hämtar en användare via email och skickar en
 * JSON-array till klienten, om emailen inte hittas i databasen
 * skickas ett felmeddelande till klienten.
 **/
exports.getUserByEmail = async (req, res) => {
    try {
        const user = await userService.getUserByEmail(req.params.email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        handleError(res, error);
    }
};

// ---------- UPDATE ----------

/**
 * updateUser letar upp en användare genom id och uppdaterar sedan användarnamn,
 * email och/eller lösenord beroende om de är tillagda i req och korrekt formaterade.
 * Om användaren hittas och alla parametrar är korrekt angivna uppdateras användaren
 * genom service metoden.
 **/
exports.updateUser = async (req, res) => {
    const id = parseId(req);
    if (!id) {
        return res.status(400).json({ error: 'Invalid user id' });
    }

    const { username, email, password } = req.body ?? {};

    if (username === undefined && email === undefined && password === undefined) {
        return res.status(400).json({ error: 'Provide username, email and/or password' });
    }
    if (username !== undefined && !isValidUsername(username)) {
        return res.status(400).json({ error: 'Username must be 3–50 characters' });
    }
    if (email !== undefined && !isValidEmail(email)) {
        return res.status(400).json({ error: 'Email is not valid' });
    }
    if (password !== undefined && !isValidPassword(password)) {
        return res.status(400).json({ error: 'Password must be at least 8 characters (max 72 bytes)' });
    }

    try {
        const updated = await userService.updateUser(id, {
            username: username?.trim(),
            email: email?.trim(),
            password
        });
        if (!updated) {
            return res.status(404).json({ error: 'User not found' });
        }
        const user = await userService.getUserById(id);
        res.json(user);
    } catch (error) {
        handleError(res, error);
    }
};
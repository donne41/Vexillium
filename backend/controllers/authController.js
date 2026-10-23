const authService = require('../services/authService');

const LOGIN_FAILED = 'Fel användarnamn, e-post eller lösenord';

/**
 * login loggar in en användare med användarnamn eller email (identifier) och lösenord.
 * Vid lyckad inloggning sparas { id, username } i sessionen och skickas till klienten.
 * Okänd användare och fel lösenord ger samma svar (401).
 */
exports.login = async (req, res) => {
    const { identifier, password } = req.body ?? {};

    if (typeof identifier !== 'string' || identifier.trim() === ''
    || typeof password !== 'string' || password === '') {
        return res.status(400).json({ error: 'Ange användarnamn eller e-post samt lösenord' });
    }

    try {
        const user = await authService.verifyCredentials(identifier.trim(), password);
        if (!user) {
            return res.status(401).json({ error: LOGIN_FAILED });
        }

        await authService.recordLogin(user.id);

        req.session.regenerate((error) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Ett internt serverfel uppstod' });
            }
            req.session.user = user;
            res.json(user);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ett internt serverfel uppstod' });
    }
};

/**
 * logout avslutar sessionen på servern och tar bort session-cookien i webbläsaren.
 * Svarar 204 även om ingen var inloggad, eftersom resultatet blir detsamma: utloggad.
 */
exports.logout = (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Ett internt serverfel uppstod' });
        }
        res.clearCookie('connect.sid');
        res.status(204).send();
    });
};

/**
 * me skickar den inloggade användaren ({ id, username }) till klienten.
 * Routen skyddas av requireAuth, så hit når bara inloggade användare.
 */
exports.me = (req, res) => {
    res.json(req.user);
};
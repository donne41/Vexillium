/**
 * requireAuth släpper bara igenom inloggade användare. Saknas req.user svarar
 * den med 401, annars skickas requesten vidare. Förutsätter att attachUser
 * redan har körts (den monteras globalt i app.js).
 */
function requireAuth(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: 'Du måste vara inloggad'})
    }
    next()
}

module.exports = requireAuth;
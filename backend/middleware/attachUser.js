const userService = require('../services/userService');

async function attachUser(req, res, next) {
    req.user = null;

    if (!req.session.user) {
        return next();
    }

    try {
        const user = await userService.getUserById(req.session.user.id);

        if (!user) {
            delete req.session.user;
            return next();
        }

        req.user = {
            id: user.id,
            username: user.username,
            role: user.role
        };

        next();
    } catch (error) {
        next(error);
    }
}

module.exports = attachUser;
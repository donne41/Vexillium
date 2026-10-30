function requireAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            error: 'Du måste vara administratör'
        });
    }

    next();
}

module.exports = requireAdmin;
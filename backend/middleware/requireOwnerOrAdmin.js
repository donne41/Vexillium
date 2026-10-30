function requireOwnerOrAdmin(req, res, next) {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({
            error: 'Ogiltigt användar-ID'
        });
    }

    const isOwner = Number(req.user.id) === id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
        return res.status(403).json({
            error: 'Du har bara tillgång till ditt eget konto'
        });
    }

    next();
}

module.exports = requireOwnerOrAdmin;
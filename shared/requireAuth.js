function requireAuth(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect(`/login?redirect=${encodeURIComponent(req.originalUrl)}`)
    }
}

module.exports = requireAuth

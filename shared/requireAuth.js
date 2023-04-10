function requireAuth(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect("/login");
    }
}

module.exports = requireAuth

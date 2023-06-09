const SubApp = require("../subapp")

module.exports = class extends SubApp {
    static NAME = "login"
    static SLUG = "/login"

    configureRouter(router) {
        router.get("/", this.redirectIfLoggedIn, (req, res) => {
            res.render("login")
        })

        router.post("/", this.redirectIfLoggedIn, (req, res) => {
            const username = req.body.username.toLowerCase()

            if (!username) {
                res.redirect("/login")
                return
            }

            const user = this.app.store.get(username)
            if (!user) {
                res.render("login", {
                    error: "User not found"
                })
                return
            }

            req.session.user = username
            res.redirect(req.query.redirect || "/")
        })
    }

    /* MIDDLEWARE */
    redirectIfLoggedIn(req, res, next) {
        if (req.session.user) {
            res.redirect(req.query.redirect || "/")
        } else {
            next()
        }
    }
}

const SubApp = require("../subapp")

module.exports = class extends SubApp {
    NAME = "login"
    SLUG = "/login"

    configureRouter(router) {
        router.get("/", (req, res) => {
            res.render("login")
        })

        router.post("/", (req, res) => {
            const username = req.body.username

            if (!username) {
                res.redirect("/login")
                return
            }

            const user = this.store.get(username)
            if (!user) {
                res.render("login", {
                    error: "User not found"
                })
                return
            }

            req.session.user = user
            res.redirect("/")
        })
    }
}

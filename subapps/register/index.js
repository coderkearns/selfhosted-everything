const SubApp = require("../subapp")

module.exports = class extends SubApp {
    NAME = "register"
    SLUG = "/register"

    configureRouter(router) {
        router.get("/", (req, res) => {
            res.render("register")
        })

        router.post("/", (req, res) => {
            const username = req.body.username

            if (!username) {
                res.redirect("/register")
                return
            }

            if (this.app.store.has(username)) {
                res.render("register", {
                    error: "User already exists"
                })
                return
            }

            const user = {
                username,
                data: {}
            }
            this.app.store.set(username, user)
            res.redirect("/login")
        })
    }
}

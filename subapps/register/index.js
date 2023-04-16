const SubApp = require("../subapp")

module.exports = class extends SubApp {
    static NAME = "register"
    static SLUG = "/register"

    configureRouter(router) {
        router.get("/", this.app.subapps.login.redirectIfLoggedIn, (req, res) => {
            res.render("register")
        })

        router.post("/", this.app.subapps.login.redirectIfLoggedIn, (req, res) => {
            const username = req.body.username.toLowerCase()

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

            this.registerUser(username)
            res.redirect("/login")
        })
    }

    /* CONTROLLERS */
    registerUser(username) {
        const user = {
            username,
            settings: {}
        }
        this.app.store.set(username, user)
    }
}

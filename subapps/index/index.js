const SubApp = require("../subapp")

module.exports = class extends SubApp {
    NAME = "index"
    SLUG = "/"

    configureRouter(router) {
        router.get("/", (req, res) => {
            res.render("index")
        })
    }
}

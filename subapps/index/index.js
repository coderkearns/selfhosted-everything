const SubApp = require("../subapp")

module.exports = class extends SubApp {
    static NAME = "index"
    static SLUG = "/"

    configureRouter(router) {
        router.get("/", (req, res) => {
            res.render("index")
        })
    }
}

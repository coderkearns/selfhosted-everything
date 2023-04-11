const SubApp = require("../subapp")

const requireAuth = require("../../shared/requireAuth")

module.exports = class extends SubApp {
    static NAME = "testAuth"
    static SLUG = "/testauth"

    configureRouter(router) {
        router.use(requireAuth)

        router.get("/", (req, res) => {
            res.send(this.app.subapps.ping.getTimestamp())
        })
    }
}

const SubApp = require("../subapp")

const requireAuth = require("../../shared/requireAuth")

module.exports = class extends SubApp {
    NAME = "testAuth"
    SLUG = "/testauth"

    configureRouter(router) {
        router.use(requireAuth)

        router.get("/", (req, res) => {
            res.send(this.app.subapps.ping.getTimestamp())
        })
    }
}

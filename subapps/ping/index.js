const SubApp = require("../subapp")

module.exports = class extends SubApp {
    static NAME = "ping"
    static SLUG = "/ping"

    configureRouter(router) {
        router.get("/", (req, res) => {
            res.send("pong")
        })

        router.get("/timestamp", (req, res) => {
            res.send(this.getTimestamp())
        })
    }

    /* CONTROLLERS */
    getTimestamp() {
        return Date().toLocaleString()
    }
}

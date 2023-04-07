const express = require("express")
const path = require("path")
const { registerSubApps } = require("./util")
const Store = require("./util/store")

const app = express()

app.users = new Store(path.join(__dirname, "data", "users.json"))

app.use("/assets", express.static("assets"))

registerSubApps(app,
    require("./subapps/ping"),
)

app.close = () => {
    app.users.save()
    for (const subApp in app.subapps) {
        app.subapps[subApp].close()
    }
}

module.exports = app

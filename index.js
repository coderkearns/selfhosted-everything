const express = require("express")

const app = express()
module.exports = app

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const modules = require("./modules")
registerSubModules(app,
    modules.useViewEngine,
    modules.useAssets,
    modules.useSession,
    modules.useStore(`global.json`)
)

registerSubApps(app,
    require("./subapps/ping"),
    require("./subapps/index"),
    require("./subapps/register"),
    require("./subapps/login"),
    require("./subapps/testauth"),
)

// 404 Handler
app.use((req, res) => {
    res.sendStatus(404)
})

// 500 Handler
app.use((err, req, res, next) => {
    console.error(err)
    res.sendStatus(500)
})

app.close = () => {
    app.store.save()
    for (const subApp in app.subapps) {
        app.subapps[subApp].close()
    }
}


function registerSubApps(app, ...subapps) {
    app.subapps = {}
    for (const subApp of subapps) {
        const instance = new subApp(app)
        app.subapps[instance.NAME] = instance
        app.use(instance.SLUG, instance.router)
    }
}

function registerSubModules(app, ...modules) {
    for (const module of modules) {
        module(app)
    }
}

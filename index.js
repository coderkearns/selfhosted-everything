const express = require("express")

const app = express()
module.exports = app

app.__dirname = __dirname

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
    require("./subapps/files"),
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
    for (const subApp in app.subapps) {
        console.log(`[subapp] Closing ${subApp}`)
        app.subapps[subApp].close()
    }

    console.log(`[app] Closing global store`)
    app.store.save()
}


function registerSubApps(app, ...subapps) {
    app.subapps = {}
    for (const subApp of subapps) {
        console.log(`[subapp] Initializing ${subApp.NAME}`)
        const instance = new subApp(app)
        app.subapps[subApp.NAME] = instance
        app.use(subApp.SLUG, instance.router)
    }
    for (const subApp in app.subapps) {
        console.log(`[subapp] Configuring ${subApp}`)
        app.subapps[subApp].configure()
    }
}

function registerSubModules(app, ...modules) {
    for (const module of modules) {
        module(app)
    }
}

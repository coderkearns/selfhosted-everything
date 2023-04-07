function registerSubApps(app, ...modules) {
    app.subapps = {}
    for (const subApp of modules) {
        const instance = new subApp(app)
        app.subapps[instance.NAME] = instance
        app.use(instance.SLUG, instance.router)
    }
}

module.exports = { registerSubApps }

const Store = require("../shared/store")

module.exports = function (savePath) {
    return function useStore(app) {
        console.log(`[app] Initializing global store`)
        app.store = Store.loadFrom(savePath)

        app.store.interval = setInterval(() => {
            console.log(`[app] Saving global store...`)
            app.store.save()
        }, 30 * 60 * 1000)
    }
}

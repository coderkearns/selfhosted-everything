const Store = require("../shared/store")

module.exports = function useStore(savePath) {
    return function use(app) {
        app.store = Store.loadFrom(savePath)
    }
}

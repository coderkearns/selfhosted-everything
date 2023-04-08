const fs = require("fs")

module.exports = function useStore(savePath) {
    return function use(app) {
        app.store = Store.loadFrom(savePath)
    }
}

class Store extends Map {
    constructor(savePath, data) {
        super(data)
        this.savePath = savePath
    }

    static loadFrom(savePath) {
        let data
        if (!fs.existsSync(this.savePath)) {
            data = []
        } else {
            data = JSON.parse(fs.readFileSync(this.savePath))
        }

        return new Store(savePath, data)
    }

    save() {
        fs.writeFileSync(this.savePath, JSON.stringify(Array.from(this)))
    }

}

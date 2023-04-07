const fs = require("fs")

module.exports = class Store extends Map {
    constructor(path) {
        const data = Store.load(path)
        super(data)
        this.path = path

    }

    static load(path) {
        try {
            return JSON.parse(fs.readFileSync(path, "utf8"))
        } catch (e) {
            return []
        }
    }

    save() {
        fs.writeFileSync(this.path, JSON.stringify(Array.from(this.entries())))
    }
}

const fs = require("fs")
const path = require("path")

const DATA_PATH = path.resolve(__dirname, "..", "data")

class Store extends Map {
    constructor(saveFile, data) {
        super(data)
        this.saveFile = path.join(DATA_PATH, saveFile)
    }

    static loadFrom(saveFile) {
        let data
        if (!fs.existsSync(this.saveFile)) {
            data = []
        } else {
            data = JSON.parse(fs.readFileSync(this.saveFile))
        }

        return new Store(saveFile, data)
    }

    save() {
        fs.writeFileSync(this.saveFile, JSON.stringify(Array.from(this)))
    }

}

module.exports = Store

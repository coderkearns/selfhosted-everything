const fs = require("fs")
const path = require("path")

const DATA_PATH = path.resolve(__dirname, "..", "data")

class Store extends Map {
    constructor(saveFile, data) {
        super(data)
        this.saveFile = saveFile
    }

    static loadFrom(saveFile) {
        saveFile = path.join(DATA_PATH, saveFile)

        let data
        if (!fs.existsSync(saveFile)) {
            data = []
        } else {
            data = JSON.parse(fs.readFileSync(saveFile))
        }

        return new Store(saveFile, data)
    }

    save() {
        fs.writeFileSync(this.saveFile, JSON.stringify(Array.from(this)))
    }

}

module.exports = Store

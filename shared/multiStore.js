const fs = require("fs")
const path = require("path")

const DATA_PATH = path.resolve(__dirname, "..", "data")

const NOT_LOADED = Symbol("NOT_LOADED")

class MultiStore extends Map {
    constructor(saveFolder, names) {
        super()
        this.saveFolder = saveFolder

        for (let name of names) {
            this.set(name, NOT_LOADED)
        }
    }

    static loadFrom(saveFolder) {
        saveFolder = path.join(DATA_PATH, saveFolder)

        if (!fs.existsSync(saveFolder)) {
            fs.mkdirSync(saveFolder)
        }

        const files = fs.readdirSync(saveFolder)

        return new MultiStore(saveFolder, files)
    }

    get(name) {
        let value = super.get(name)
        if (value === NOT_LOADED) {
            value = this._loadKey(name)
            this.set(name, value)
        }
        return value
    }

    _loadKey(name) {
        const saveFile = path.join(this.saveFolder, name)
        return JSON.parse(fs.readFileSync(saveFile))
    }

    save() {
        for (let [name, value] of this) {
            if (value === NOT_LOADED) {
                continue
            }
            fs.writeFileSync(path.join(this.saveFolder, name), JSON.stringify(value))
        }
    }
}

module.exports = MultiStore

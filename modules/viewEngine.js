const path = require("path")

function useViewEngine(app) {
    app.set("view engine", "ejs")
    app.set("views", path.join(__dirname, "..", "views"))
}

module.exports = useViewEngine

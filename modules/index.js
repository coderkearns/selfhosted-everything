const path = require("path")
const express = require("express")
const session = require("express-session")

function useViewEngine(app) {
    app.set("view engine", "ejs")
    app.set("views", path.join(__dirname, "..", "views"))
}

function useAssets(app) {
    app.use("/assets", express.static("assets"))
}

function useSession(app) {
    app.set("trust proxy", 1)
    app.use(session({
        secret: "1d2cee1bb8edef110bf75d1576a613fd",
        resave: false,
        saveUninitialized: true,
    }))
}

module.exports = {
    useViewEngine,
    useAssets,
    useSession,
    useStore: require("./store")
}

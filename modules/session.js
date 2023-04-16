const session = require("express-session")
const FileStore = require("session-file-store")(session)

function useSession(app) {
    app.set("trust proxy", 1)
    app.use(session({
        store: FileStore(),
        secret: "1d2cee1bb8edef110bf75d1576a613fd",
        resave: true,
        saveUninitialized: true,
    }))
}

module.exports = useSession

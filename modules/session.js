const session = require("express-session")

function useSession(app) {
    app.set("trust proxy", 1)
    app.use(session({
        secret: "1d2cee1bb8edef110bf75d1576a613fd",
        resave: false,
        saveUninitialized: true,
    }))
}

module.exports = useSession

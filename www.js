const app = require("./index")

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

process.on("SIGINT", () => {
    console.log("Closing...")
    app.close()
    server.close(() => {
        process.exit(0)
    })
})

process.on("uncaughtException", (err) => {
    console.error(err)
    console.log("Closing...")
    app.close()
    server.close(() => {
        process.exit(1)
    })
})

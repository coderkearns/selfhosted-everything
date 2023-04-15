const app = require("./index")

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`[server] Listening on port ${PORT}`)
})

server.on('upgrade', (request, socket, head) => {
    app.wss.handleUpgrade(request, socket, head, socket => {
        app.wss.emit('connection', socket, request);
    });
});

global.app = app
global.server = server

function shutdown(err) {
    setTimeout(() => {
        console.log("[server] Timed out closing...")
        process.exit(1)
    }, 10000)

    if (err) {
        console.log("[app] Closing from error...")
        console.error(err)
    } else {
        console.log("[app] Closing cleanly...")
    }

    app.close()

    console.log("[server] Closing...")
    server.close(() => {
        process.exit(err ? 1 : 0)
    })
}

process.on("SIGINT", () => shutdown())
process.on("SIGUSR2", () => shutdown())
process.on("SIGUSR1", () => shutdown())
process.on("SIGTERM", () => shutdown())
process.on("uncaughtException", err => shutdown(err))

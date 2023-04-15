// create a websocket server
const { Server } = require("ws")

module.exports = function useWebsocket(app) {
    app.ws = {
        connections: [],
        listeners: {},
        on(event, callback) {
            if (!this.listeners[event]) {
                this.listeners[event] = []
            }
            this.listeners[event].push(callback)
        },
        emit(connection, event, data) {
            this.listeners[event].forEach(callback => callback(connection, data))
        }
    }

    const wss = new Server({ noServer: true })
    app.wss = wss

    wss.on("connection", function connection(ws) {
        app.ws.connections.push(ws)

        ws.on("message", function incoming(message) {
            const data = JSON.parse(message)
            app.ws.emit(ws, data.event, data.data)
        })
    })
}

// create a websocket server
const ws = require("ws")

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
        emit(event, ...args) {
            this.listeners[event].forEach(callback => callback(...args))
        }
    }

    const wss = new ws.Server({ noServer: true })
    app.wss = wss

    wss.on("connection", function connection(ws) {
        app.ws.connections.push(ws)

        ws.on("message", function incoming(message) {
            const data = JSON.parse(message)
            app.ws.emit(data.event, data.data)
        })
    })
}

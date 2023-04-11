const express = require("express")

module.exports = class SubApp {
    constructor(app) {
        this.app = app
        this.router = express.Router()

        this.initialize()
    }

    initialize() { }
    close() { }

    configure() {
        this.configureRouter(this.router)
    }
    configureRouter(router) { }
}

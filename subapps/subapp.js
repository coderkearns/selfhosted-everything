const express = require("express")

module.exports = class SubApp {
    constructor(app) {
        this.app = app
        this.router = express.Router()

        this.initialize()
        this.configureRouter(this.router)
    }

    initialize() { }
    close() { }

    configureRouter(router) { }
}

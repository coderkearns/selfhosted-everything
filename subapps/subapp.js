const express = require("express")

module.exports = class SubApp {
    static NAME = "_DEFAULT_NAME"
    static SLUG = "_DEFAULT_SLUG"

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

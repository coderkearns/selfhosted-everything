const path = require("path")
const express = require("express")

function useAssets(app) {
    app.use("/assets", express.static(path.resolve(__dirname, "..", "assets")))
}

module.exports = useAssets

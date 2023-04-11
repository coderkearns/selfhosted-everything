const os = require("os")
const path = require("path")
const fs = require("fs")

const SubApp = require("../subapp")
const requireAuth = require("../../shared/requireAuth")

const multer = require("multer")

// ~/Public/uploads
const UPLOADS_PATH = path.join(os.homedir(), "Public", "uploads")

const fileUpload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, UPLOADS_PATH)
        },


        filename: function (req, file, cb) {
            let filename = `${req.session.user}-${Date.now()}`
            cb(null, filename)
        }
    })
})

module.exports = class extends SubApp {
    NAME = "files"
    SLUG = "/files"

    initialize() {
        if (!fs.existsSync(UPLOADS_PATH)) {
            fs.mkdirSync(UPLOADS_PATH)
        }
    }

    configureRouter(router) {
        router.use(requireAuth)

        router.get("/", (req, res) => {
            res.render("files/index", {
                files: this.getFilesMap(req)
            })
        })

        router.get("/download", (req, res) => {
            const file = req.query.file
            if (fs.existsSync(path.join(UPLOADS_PATH, file))) {
                this.streamFile(req, file).pipe(res)
                return
            }
            res.redirect("/files")
        })

        router.get("/upload", (req, res) => {
            res.render("files/upload")
        })

        router.post("/upload", fileUpload.single("itemFile"), (req, res) => {
            const userFiles = this.getFilesMap(req)
            userFiles[req.body.itemName] = req.file.filename
            res.redirect("/files")
        })

    }

    /* CONTROLLERS */
    getFilesMap(req) {
        return this.app.store.get(req.session.user).data.files || {}
    }

    streamFile(req, file) {
        return fs.createReadStream(path.join(UPLOADS_PATH, file))
    }
}

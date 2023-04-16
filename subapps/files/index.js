const os = require("os")
const path = require("path")
const fs = require("fs")

const SubApp = require("../subapp")
const requireAuth = require("../../shared/requireAuth")
const Store = require("../../shared/store")

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
    static NAME = "files"
    static SLUG = "/files"

    initialize() {
        if (!fs.existsSync(UPLOADS_PATH)) {
            fs.mkdirSync(UPLOADS_PATH)
        }

        this.store = Store.loadFrom("files.json")
    }

    configureRouter(router) {
        router.use(requireAuth)

        router.get("/", (req, res) => {
            const user = this.getUser(req.session.user)

            res.render("files/index", {
                files: user.files
            })
        })

        router.get("/download", (req, res) => {
            const file = req.query.file
            if (fs.existsSync(path.join(UPLOADS_PATH, file))) {
                this.streamFile(file, res)
                return
            } else {
                res.redirect("/files")
            }
        })

        router.get("/delete", (req, res) => {
            const file = req.query.file
            this.deleteFile(req.session.user, file)
            res.redirect("/files")
        })

        router.get("/upload", (req, res) => {
            res.render("files/upload")
        })

        router.post("/upload", fileUpload.single("itemFile"), (req, res) => {
            this.addFile(req.session.user, req.body.itemName, req.file.filename)
            res.redirect("/files")
        })

    }

    close() {
        this.store.save()
    }

    /* CONTROLLERS */
    getUser(username) {
        let user = this.store.get(username)
        if (!user) {
            user = { files: {} }
            this.store.set(username, user)
        }
        return user
    }

    addFile(username, name, file) {
        const user = this.getUser(username)
        user.files[name] = file
    }

    deleteFile(username, file) {
        const user = this.getUser(username)
        const name = Object.entries(user.files).filter(e => e[1] === file)[0][0]
        delete user.files[name]
        this.store.set(username, user)
        fs.unlinkSync(path.join(UPLOADS_PATH, file))
        this.store.save()
    }

    streamFile(file, res) {
        return fs.createReadStream(path.join(UPLOADS_PATH, file)).pipe(res)
    }
}

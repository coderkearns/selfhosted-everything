const SubApp = require("../subapp")
const requireAuth = require("../../shared/requireAuth")
const Store = require("../../shared/store")

module.exports = class extends SubApp {
    static NAME = "notes"
    static SLUG = "/notes"

    initialize() {
        this.store = Store.loadFrom("notes.json")
    }

    configureRouter(router) {
        router.use(requireAuth)

        router.get("/", (req, res) => {
            const user = this.getUser(req.session.user)

            res.render("notes/index", {
                notes: user.notes
            })
        })

        router.get("/new", (req, res) => {
            const user = this.getUser(req.session.user)

            res.render("notes/note", {
                note: { title: "", contents: "" },
                notes: user.notes,
                form: "method='POST' action='/notes/'"
            })
        })

        router.post("/", (req, res) => {
            const id = this.addNote(req.session.user, req.body.title, req.body.contents)
            res.redirect(`/notes/${id}`)
        })

        router.get("/:id", (req, res) => {
            const user = this.getUser(req.session.user)

            const note = user.notes[req.params.id]
            if (!note) {
                res.redirect("/notes")
                return
            }

            res.render("notes/note", {
                note,
                notes: user.notes,
                form: `method='PUT' action='/notes/${req.params.id}'`
            })
        })

        router.put("/:id", (req, res) => {
            const user = this.getUser(req.session.user)
            const note = user.notes[req.params.id]

            if (!note) {
                res.redirect("/notes")
                return
            }

            if (req.body.title) {
                note.title = req.body.title
            }

            if (req.body.contents) {
                note.contents = req.body.contents
            }

            console.log(note)

            res.redirect(`/notes/${req.params.id}`)
        })
    }

    close() {
        this.store.save()
    }

    /* CONTROLLERS */
    getUser(username) {
        let user = this.store.get(username)
        if (!user) {
            user = { notes: {} }
            this.store.set(username, user)
        }
        return user
    }

    addNote(username, title, contents) {
        const user = this.getUser(username)
        const id = this.makeID()
        user.notes[id] = { id, title, contents }
        console.log(user.notes[id])
        return id
    }

    makeID() {
        return `${Math.random().toString(36).substr(2, 9)}`
    }
}

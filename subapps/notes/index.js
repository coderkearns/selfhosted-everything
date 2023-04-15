const express = require("express")

const SubApp = require("../subapp")
const requireAuth = require("../../shared/requireAuth")
const MultiStore = require("../../shared/multiStore")
const useApi = require("../../shared/api")

module.exports = class extends SubApp {
    static NAME = "notes"
    static SLUG = "/notes"

    initialize() {
        this.store = MultiStore.loadFrom("notes")
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
                note: { id: null, title: "", contents: "" },
                notes: user.notes
            })
        })

        router.get("/:id", (req, res) => {
            const user = this.getUser(req.session.user)

            const note = user.notes[req.params.id]
            if (!note) {
                res.redirect("/notes")
                return
            }

            res.render("notes/note", {
                note: { id: req.params.id, ...note },
                notes: user.notes,
            })
        })


        useApi(router, "/api", {
            new: (user, data) => {
                const id = this.addNote(user, data)
                return { success: true, id }
            },
            update: (user, data) => {
                this.updateNote(user, data.id, data.updates)
                return { success: true }
            },
            delete: (user, data) => {
                this.deleteNote(user, data.id)
                return { success: true }
            }
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

    _generateID() {
        return Math.random().toString(36).substr(2, 9)
    }

    addNote(username, { title, contents = "" }) {
        const user = this.getUser(username)
        const id = this._generateID()
        user.notes[id] = { title, contents }
        this.store.set(username, user)
        return id
    }

    updateNote(username, id, updates) {
        const user = this.getUser(username)
        user.notes[id] = { ...user.notes[id], ...updates }
        this.store.set(username, user)
    }

    deleteNote(username, id) {
        const user = this.getUser(username)
        delete user.notes[id]
        this.store.set(username, user)
    }

    clearNotes(username) {
        const user = this.getUser(username)
        user.notes = {}
        this.store.set(username, user)
    }
}

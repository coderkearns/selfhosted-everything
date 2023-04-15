const express = require("express")

const SubApp = require("../subapp")
const requireAuth = require("../../shared/requireAuth")
const MultiStore = require("../../shared/multiStore")

module.exports = class extends SubApp {
    static NAME = "chat"
    static SLUG = "/chat"

    initialize() {
        this.store = MultiStore.loadFrom("chats")

        this.app.ws.on("chat", (connection, data) => {
            this.app.ws.connections.forEach(c => {
                c.send(JSON.stringify({ event: "chat", data: data }))
            })
            this.addMessage(data.chat, data.message)
        })
    }

    configureRouter(router) {
        router.use(requireAuth)

        router.get("/", (req, res) => {
            const chats = this.getChats(req.session.user)

            res.render("chat/index", {
                chats
            })
        })

        router.get("/new", (req, res) => {
            const users = Array.from(this.app.store.keys())
            const user = req.session.user
            const otherUsers = users.filter(u => u !== user)

            res.render("chat/new", {
                users: otherUsers
            })
        })

        router.post("/new", express.json(), (req, res) => {
            const name = req.body.name
            const users = [req.session.user, ...req.body.users]
            const id = this.createChat(name, users)
            res.redirect(`/chat/${id}`)
        })

        router.get("/:id", (req, res) => {
            const chats = this.getChats(req.session.user)
            const chat = this.getChat(req.params.id)
            const user = req.session.user

            if (!chat) {
                res.redirect("/chat")
                return
            }

            res.render("chat/chat", {
                chats,
                chat,
                user
            })
        })
    }

    close() {
        this.store.save()
    }

    /* CONTROLLERS */
    getChat(chatID) {
        return this.store.get(chatID)
    }

    _generateID() {
        return Math.random().toString(36).substr(2, 9)
    }

    createChat(name, users) {
        const id = this._generateID()
        this.store.set(id, {
            id,
            users: users,
            name: name,
            messages: []
        })
        return id
    }

    getChats(user) {
        return Array.from(this.store.keys()).map(chatID => this.store.get(chatID)).filter(chat => chat.users.includes(user))
    }

    addMessage(chatID, message) {
        this.store.get(chatID).messages.push(message)
    }
}

const express = require("express")

module.exports = function useApi(router, path, actions) {
    router.post(path, express.json(), (req, res) => {
        const { action, data } = req.body
        if (action in actions) {
            try {
                const jsonRes = actions[action](req.session.user, data)
                res.json(jsonRes)
            } catch (e) {
                res.status(500).json({ error: e.message })
            }
        } else {
            res.status(404).json({ error: `Action '${action}' not found` })
        }
    })
}

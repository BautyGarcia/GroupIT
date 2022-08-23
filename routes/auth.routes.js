const express = require('express');
const Auth_Controller = require('../controllers/auth_Controller');

const router = express.Router();
const basePath = '/auth'

router.post("/login", async (req, res) => {
    const userInfo = req.body
    const user = await Auth_Controller.login(userInfo);

    if(user){
        req.session.user = {
            id: user.id,
            nombreUsuario: user.nombreUsuario,
            password: user.password,
            email: user.mail
        }
    }

    res.json(user);
});

router.post("/logout", async (req, res) => {
    try {
        await req.session.destroy()
        return res.sendStatus(200)
    } catch (e) {
        console.error(e)
        return res.sendStatus(403)
    }
});

router.post("/getSession", async (req, res) => {
    if (req.sessionID && req.session.user) {
        res.status(200)
        return res.json({ user: req.session.user })
    }
    return res.sendStatus(403)
});

module.exports = { router, basePath };
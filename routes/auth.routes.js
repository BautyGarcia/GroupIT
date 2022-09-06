const express = require('express');
const jwt = require('jsonwebtoken')
const Auth_Controller = require('../controllers/auth_Controller');

const router = express.Router();
const basePath = '/auth'

//--------JWT---------
let refreshTokens = []

function generateAccessToken (user) {
    return jwt.sign (user, process.env.ACCESS_TOKEN_SECRET, { expiresIn : '24h' } )
}

//----------Routes------------

router.post("/login", async (req, res) => {
    const username = req.body.username
    const user = { payload: { name : username } }
    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    res.cookie("refreshToken", refreshToken, {maxAge: 15 * 60 * 1000, httpOnly: true })
    res.cookie("accessToken", accessToken, {maxAge: 24 * 60 * 60 * 1000, httpOnly: true })
    refreshTokens.push(refreshToken)
    res.json({ accessToken : accessToken, refreshToken : refreshToken })
});

router.post("/logout", async (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
});

/*
router.post("/getSession", async (req, res) => {
    if (req.sessionID && req.session.user) {
        res.status(200)
        return res.json({ user: req.session.user })
    }
    return res.sendStatus(403)
});
*/


module.exports = { router, basePath };
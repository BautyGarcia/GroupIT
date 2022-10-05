require("dotenv").config()
const express = require('express');
const jwt = require('jsonwebtoken')
const Auth_Controller = require('../controllers/auth_Controller');
const User_Controller = require('../controllers/user_Controller');

const router = express.Router();
const basePath = '/auth'

//--------JWT---------

const authorization = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
      return res.sendStatus(403).json({ message: 'You are not logged in' });
    }
    try {
      const data = jwt.verify(token, process.env.SECRET_KEY);
      req.nombreUsuario = data.nombreUsuario;
      req.mail = data.mail;
      return next();
    } catch {
      return res.sendStatus(403);
    }
};

//----------Routes------------

router.post("/login", async (req, res) => {
    const authInfo = req.body
    let checkUser;

    try {
      checkUser = await Auth_Controller.login(authInfo);
    }
    catch (err) {
      return res.status(400).json({ message: 'Wrong username or password' });
    }
    
    const token = jwt.sign({ nombreUsuario: checkUser.nombreUsuario, mail: checkUser.mail }, process.env.SECRET_KEY, { expiresIn: "30m" });
    
    const options = {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 30),
      withCredentials: true
    };

    res.cookie("access_token", token, options)
    .status(200)
    .json({ message: true, token })
    .send()
});

router.get("/logout", async (req, res) => {
    try {
      return res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "Successfully logged out 😏 🍀" });
    }
    catch (err) {
      console.error(err.message);
    }
});

router.get("/getSession", authorization, async (req, res) => {
    try {
      return res.json({ user: { nombreUsuario: req.nombreUsuario, mail: req.mail } });
    }
    catch (err) {
      console.error(err.message);
    }
});

module.exports = { router, basePath };
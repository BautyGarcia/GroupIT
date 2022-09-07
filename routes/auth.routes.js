require("dotenv").config()
const express = require('express');
const jwt = require('jsonwebtoken')
const Auth_Controller = require('../controllers/auth_Controller');

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
      req.password = data.password;
      return next();
    } catch {
      return res.sendStatus(403);
    }
};

//----------Routes------------

router.get("/login", async (req, res) => {
    const authInfo = req.body
    const token = jwt.sign({ nombreUsuario: authInfo.nombreUsuario, password: authInfo.password }, process.env.SECRET_KEY, { expiresIn: "30s" });
    
    const checkUser = await Auth_Controller.login(authInfo);
    
    if (checkUser){
        return res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .status(200)
        .json({ message: "Logged in successfully 😊 👌" });
    } else {
        return res.status(401).json({ message: "That user does not exist" })
    }
});

router.get("/logout", async (req, res) => {
    return res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Successfully logged out 😏 🍀" });
});

router.get("/getSession", authorization, async (req, res) => {
    return res.json({ user: { nombreUsuario: req.nombreUsuario, password: req.password } });
});

module.exports = { router, basePath };
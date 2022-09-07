require("dotenv").config()
const express = require('express');
const jwt = require('jsonwebtoken')
const User_Controller = require('../controllers/user_Controller');

const router = express.Router();
const basePath = '/user'

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

router.get("/all", async (req, res) => {
    const users = await User_Controller.getAllUsers();
    res.json(users);
});

router.post("", async (req, res) => {
    const userInfo = req.body
    const token = jwt.sign({ nombreUsuario: userInfo.nombreUsuario, password: userInfo.password }, process.env.SECRET_KEY, { expiresIn: "30s" });
    const user = await User_Controller.createUser(userInfo);

    if (user){
        return res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .status(200)
        .json(user);
    } else {
        return res.status(401).json({ message: "That username or eMail has already been taken" })
    }
});

router.put("/password", authorization, async (req, res) => {
    const userInfo = req.body
    userInfo.nombreUsuario = req.nombreUsuario
    const user = await User_Controller.updatePassword(userInfo);
    res.json(user);
});

router.delete("", authorization, async (req, res) => {
    const userInfo = req.body
    userInfo.nombreUsuario = req.nombreUsuario
    const user = await User_Controller.deleteUser(userInfo);

    if (user){
        res.clearCookie("access_token").json(user);
    }
});

module.exports = { router, basePath };
require("dotenv").config()
const express = require('express');
const jwt = require('jsonwebtoken');
const user_Controller = require("../controllers/user_Controller");
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
      return res.sendStatus(403).json({ message: 'You are not logged in' });
    }
};

//----------Routes------------

router.get("/all", async (req, res) => {
    const users = await User_Controller.getAllUsers();
    res.json(users);
});

router.get("/sendEmail", authorization, async (req, res) => {
    const userInfo = req.body
    userInfo.nombreUsuario = req.nombreUsuario
    const email = await User_Controller.getEmail(userInfo);

    userInfo.email = email.mail;
    const sendEmail = await User_Controller.sendEmail(userInfo);

    if (!sendEmail){
        return res.status(200).json({ message : "Something went wrong with the email"})
    }
    return res.send(`Email sent to ${userInfo.email}`);
})

router.get("/email", authorization, async (req, res) => {
    const userInfo = req.body
    userInfo.nombreUsuario = req.nombreUsuario
    const user = await User_Controller.getEmail(userInfo);
    return res.json(user);
})

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

    if (user){
        return res.status(200).json(user);
    } else {
        return res.status(401).json({ message: "Password is not correct or old passoword is the same as new one" })
    }
});

router.delete("", authorization, async (req, res) => {
    const userInfo = req.body
    userInfo.nombreUsuario = req.nombreUsuario
    const user = await User_Controller.deleteUser(userInfo);

    if (user){
        res.clearCookie("access_token").json(user);
    } else {
        return res.status(401).json({ message: "Password is not correct or user does not exist" })
    }
});

module.exports = { router, basePath };
require("dotenv").config()
const express = require('express');
const jwt = require('jsonwebtoken');
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
      req.mail = data.mail;
      return next();
    } catch {
      return res.sendStatus(403).json({ message: 'You are not logged in' });
    }
};

//----------Routes------------

router.get("/all", async (req, res) => {
    try {
        const users = await User_Controller.getAllUsers();
        return res.json(users);
    }
    catch (err) {
        console.error(err.message);
        return res.status(400).json({ message: 'Could not get all users'});
    }
});

router.get("/sendEmail", authorization, async (req, res) => {
    const userInfo = req.body
    userInfo.nombreUsuario = req.nombreUsuario
    userInfo.email = req.mail;

    try {    
        await User_Controller.sendEmail(userInfo);
        return res.json({ message :`Email sent to ${userInfo.email}` });
    }
    catch (err) {
        console.error(err.message);
        return res.status(400).json({ message : "Something went wrong with the email"})
    }
})

router.post("", async (req, res) => {
    
    const userInfo = req.body

    try {
        await User_Controller.createUser(userInfo);
    }
    catch (err) {
        console.error(err.message);
        return res.status(400).json({ message: 'Could not create user'});
    }

    const token = jwt.sign({ nombreUsuario: userInfo.nombreUsuario, mail: userInfo.mail }, process.env.SECRET_KEY, { expiresIn: "30m" });

    const options = {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 30),
        withCredentials: true
    };

    res.cookie("access_token", token, options)
    .status(200)
    .json({ message: true, token })
    .send();
});


router.put("/password", authorization, async (req, res) => {
    const userInfo = req.body
    userInfo.nombreUsuario = req.nombreUsuario
    
    try {
        const newUser = await User_Controller.updatePassword(userInfo);
        return res.status(200).json(newUser);
    }
    catch (err) {
        console.error(err.message);
        return res.status(401).json({ message: "Password is not correct or old passoword is the same as new one" })
    }
});

router.delete("", authorization, async (req, res) => {
    const userInfo = req.body
    userInfo.nombreUsuario = req.nombreUsuario
    
    try {
        const user = await User_Controller.deleteUser(userInfo);
        return res.clearCookie("access_token").json(user).status(200);
    }
    catch (err) {
        console.error(err.message);
        return res.status(401).json({ message: "Password is not correct or user does not exist" });
    }
});

module.exports = { router, basePath };
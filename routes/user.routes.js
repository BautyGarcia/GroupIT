const express = require('express');
const User_Controller = require('../controllers/user_Controller');

const router = express.Router();
const basePath = '/user'

router.get("/all", async (req, res) => {
    const users = await User_Controller.getAllUsers();
    res.json(users);
});

router.post("", async (req, res) => {
    const userInfo = req.body
    const user = await User_Controller.createUser(userInfo);
    
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

router.put("/password", async (req, res) => {
    const userInfo = req.body
    userInfo.nombreUsuario = req.session.user.nombreUsuario
    const user = await User_Controller.updatePassword(userInfo);
    res.json(user);
});

router.delete("", async (req, res) => {
    const userInfo = req.body
    userInfo.nombreUsuario = req.session.user.nombreUsuario
    const user = await User_Controller.deleteUser(userInfo);
    req.session.destroy()
    res.json(user);
});

module.exports = { router, basePath };
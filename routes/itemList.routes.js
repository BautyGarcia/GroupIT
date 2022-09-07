require("dotenv").config()
const express = require('express');
const jwt = require('jsonwebtoken')
const itemList_Controller = require('../controllers/itemList_Controller');

const router = express.Router();
const basePath = '/itemList'

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

router.get("/toBring", async (req, res) => {
    const listInfo = req.body
    const items = await itemList_Controller.getItemsToBring(listInfo);
    res.json(items);
});

router.get("/brought", async (req, res) => {
    const listInfo = req.body
    const items = await itemList_Controller.getItemsBrought(listInfo);
    res.json(items);
});

router.post("/toBring", authorization, async (req, res) => {
    const listInfo = req.body
    listInfo.nombreHost = req.nombreUsuario
    const items = await itemList_Controller.setItemsToBring(listInfo);
    res.json(items);
});

router.post("/brought", authorization, async (req, res) => {
    const listInfo = req.body
    listInfo.nombreUsuario = req.nombreUsuario
    const items = await itemList_Controller.setItemsBrought(listInfo);
    res.json(items);
});


module.exports = { router, basePath };

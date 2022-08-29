const express = require('express');
const itemList_Controller = require('../controllers/itemList_Controller');

const router = express.Router();
const basePath = '/itemList'

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

router.post("/toBring", async (req, res) => {
    const listInfo = req.body
    listInfo.nombreHost = req.session.user.nombreUsuario
    const items = await itemList_Controller.setItemsToBring(listInfo);
    res.json(items);
});

router.post("/brought", async (req, res) => {
    const listInfo = req.body
    listInfo.nombreUsuario = req.session.user.nombreUsuario
    const items = await itemList_Controller.setItemsBrought(listInfo);
    res.json(items);
});


module.exports = { router, basePath };

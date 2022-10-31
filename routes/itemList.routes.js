require("dotenv").config()
const express = require('express');
const jwt = require('jsonwebtoken')
const itemList_Controller = require('../controllers/itemList_Controller');
const Event_Controller = require('../controllers/event_Controller');

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
      req.mail = data.mail;
      return next();
    } catch {
      return res.sendStatus(403);
    }
};

//----------Routes------------

router.post("/toBring", async (req, res) => {
  const listInfo = req.body
  const EventId = listInfo.idEvento;
  
  try {
    const eventName = await Event_Controller.getEvent(EventId);
    listInfo.nombreEvento = eventName.nombre;
    const items = await itemList_Controller.getItemsToBring(listInfo);
    return res.json(items).status(200);
  }
  catch (err) {
    console.error(err.message);
    return res.status(400).json({ message: 'Could not get items'});
  }
});

router.post("/brought", async (req, res) => {
    const listInfo = req.body
    const EventId = listInfo.idEvento;

    try {
      const eventName = await Event_Controller.getEvent(EventId);
      listInfo.nombreEvento = eventName.nombre;
      const items = await itemList_Controller.getItemsBrought(listInfo);
      return res.json(items);
    }
    catch (err) {
      console.error(err.message);
      return res.status(400).json({ message: 'Could not get items'});
    }
});

router.post("/setToBring", authorization, async (req, res) => {
    const listInfo = req.body
    listInfo.nombreHost = req.nombreUsuario
    const EventId = listInfo.idEvento;

    try {
      const eventName = await Event_Controller.getEvent(EventId);
      listInfo.nombreEvento = eventName.nombre;
      const items = await itemList_Controller.setItemsToBring(listInfo);
      return res.json(items).status(200);
    }
    catch (err) {
      console.error(err.message);
      return res.status(400).json({ message: 'Could not get items'});
    }
});

router.post("/setBrought", authorization, async (req, res) => {
    const listInfo = req.body
    listInfo.nombreUsuario = req.nombreUsuario
    const EventId = listInfo.idEvento;

    try {
      const eventName = await Event_Controller.getEvent(EventId);
      listInfo.nombreEvento = eventName.nombre;
      const items = await itemList_Controller.setItemsBrought(listInfo);
      return res.json(items);
    }
    catch (err) {
      console.error(err.message);
      return res.status(400).json({ message: 'Could not get items'});
    }
});


module.exports = { router, basePath };

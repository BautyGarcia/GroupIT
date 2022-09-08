require("dotenv").config()
const express = require('express');
const jwt = require('jsonwebtoken')
const Event_Controller = require('../controllers/event_Controller');

const router = express.Router();
const basePath = '/event'

//-----------JWT-----------

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

//-----------Routes-----------

router.get("/all", async (req, res) => {
    const events = await Event_Controller.getAllEvents();
    res.json(events);
});

router.get("/own", authorization, async (req, res) => {
    try {
        const eventInfo = req.body
        eventInfo.nombreUsuario = req.nombreUsuario
        const event = await Event_Controller.getMyEvents(eventInfo);
        res.json(event);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});

router.get("/participants", async (req, res) => {
    const eventInfo = req.body
    const participants = await Event_Controller.getEventParticipants(eventInfo);
    res.json(participants);
});

router.post("", authorization, async (req, res) => {
    try {
        const eventInfo = req.body
        eventInfo.nombreUsuario = req.nombreUsuario
        const event = await Event_Controller.createEvent(eventInfo);
        res.json(event);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});

router.post("/addUser", authorization, async (req, res) => {
    try {
        const eventInfo = req.body
        eventInfo.nombreHost = req.nombreUsuario
        const newUser = await Event_Controller.addUserToEvent(eventInfo);
        res.json(newUser);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});

router.put("", authorization, async (req, res) => {
    try {
        const eventInfo = req.body
        eventInfo.nombreUsuario = req.nombreUsuario
        const newEvent = await Event_Controller.updateEvent(eventInfo);
        res.json(newEvent);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});

router.put("/confirm", authorization, async (req, res) => {
    try {
        const eventInfo = req.body
        eventInfo.nombreUsuario = req.nombreUsuario
        const confirmedEvent = await Event_Controller.confirmEvent(eventInfo);
        res.json(confirmedEvent);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});

router.delete("/user", authorization, async (req, res) => {
    try {
        const eventInfo = req.body
        eventInfo.nombreHost = req.nombreUsuario
        const deletedUser = await Event_Controller.deleteUserFromEvent(eventInfo);
        res.json(deletedUser);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});

router.delete("", authorization, async (req, res) => {
    try {
        const eventInfo = req.body
        eventInfo.nombreHost = req.nombreUsuario
        const deletedEvent = await Event_Controller.deleteEvent(eventInfo);
        res.json(deletedEvent);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});

router.delete("/quit", authorization, async (req, res) => {
    try {
        const eventInfo = req.body
        eventInfo.nombreUsuario = req.nombreUsuario
        const quitEvent = await Event_Controller.quitEvent(eventInfo);
        res.json(quitEvent);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});

module.exports = { router, basePath };


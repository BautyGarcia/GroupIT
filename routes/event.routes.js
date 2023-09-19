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
      req.mail = data.mail;
      return next();
    } catch {
      return res.sendStatus(403).json({ message: 'You are not logged in' });
    }
};

//-----------Routes-----------

router.get("/all", async (req, res) => {
    try {
        const events = await Event_Controller.getAllEvents();
        return res.json(events);
    }
    catch (err) {
        console.error(err.message);
        return res.status(400).json({ message: 'Could not get all events'});
    }
});

router.get("/own", authorization, async (req, res) => {
    const eventInfo = req.body
    eventInfo.nombreUsuario = req.nombreUsuario

    try {
        const event = await Event_Controller.getMyEvents(eventInfo);
        return res.json(event);
    }
    catch (err) {
        console.error(err.message);
        return res.status(400).json({ message: 'Could not get your events'});
    }
});

router.post("/getEvent", async (req, res) => {
    const eventInfo = req.body

    try {
        const event = await Event_Controller.getEvent(eventInfo);
        return res.json(event);
    }
    catch (err) {
        console.error(err.message);
        return res.status(400).json({ message: 'Could not get event'});
    }
});

router.post("/participants", async (req, res) => {
    const eventInfo = req.body

    try {
        const participants = await Event_Controller.getEventParticipants(eventInfo);
        return res.json(participants);
    }
    catch (err) {
        console.error(err.message);
        return res.status(400).json({ message: 'Could not get participants'});
    }
});

router.post("", authorization, async (req, res) => {
    const eventInfo = req.body
    eventInfo.nombreUsuario = req.nombreUsuario
    console.log(eventInfo.nombreUsuario);
    try {
        const event = await Event_Controller.createEvent(eventInfo);
        return res.json(event);
    }
    catch (err) {
        console.error(err.message);
        return res.status(400).json({ message: 'Could not create event'});
    }
});

router.post("/addUser", authorization, async (req, res) => {
    const eventInfo = req.body
    eventInfo.nombreHost = req.nombreUsuario
    const eventNameInfo = eventInfo.idEvento;
    try {
        const eventName = await Event_Controller.getEvent(eventNameInfo);
        eventInfo.nombreEvento = eventName.nombre
        const newUser = await Event_Controller.addUserToEvent(eventInfo);
        res.json(newUser);
    }
    catch (err) {
        console.error(err.message);
        return res.status(400).json({ message: 'Could not add user to event'});
    }
});

router.put("", authorization, async (req, res) => {
    const eventInfo = req.body
    eventInfo.nombreUsuario = req.nombreUsuario
    
    try {
        const newEvent = await Event_Controller.updateEvent(eventInfo);
        res.json(newEvent);
    }
    catch (err) {
        console.error(err.message);
        return res.status(400).json({ message: 'Could not update event'});
    }
});

router.put("/confirm", authorization, async (req, res) => {
    const eventInfo = req.body
    eventInfo.nombreUsuario = req.nombreUsuario

    try {
        const confirmedEvent = await Event_Controller.confirmEvent(eventInfo);
        res.json(confirmedEvent);
    }
    catch (err) {
        console.error(err.message);
        return res.status(400).json({ message: 'Could not confirm event'});
    }
});

router.delete("/user", authorization, async (req, res) => {
    const eventInfo = req.body
    eventInfo.nombreHost = req.nombreUsuario

    try {
        const deletedUser = await Event_Controller.deleteUserFromEvent(eventInfo);
        res.json(deletedUser);
    }
    catch (err) {
        console.error(err.message);
        return res.status(400).json({ message: 'Could not delete user from event'});
    }
});

router.delete("", authorization, async (req, res) => {
    const eventInfo = req.body
    eventInfo.nombreHost = req.nombreUsuario

    try {
        const deletedEvent = await Event_Controller.deleteEvent(eventInfo);
        res.json(deletedEvent);
    }
    catch (err) {
        console.error(err.message)
        return res.status(400).json({ message: 'Could not delete event'});
    }
});

router.delete("/quit", authorization, async (req, res) => {
    const eventInfo = req.body
    eventInfo.nombreUsuario = req.nombreUsuario
    
    try {
        const quitEvent = await Event_Controller.quitEvent(eventInfo);
        res.json(quitEvent);
    }
    catch (err) {
        console.error(err.message);
        return res.status(400).json({ message: 'Could not quit event'});
    }
});

module.exports = { router, basePath };


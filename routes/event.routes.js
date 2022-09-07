const express = require('express');
const Event_Controller = require('../controllers/event_Controller');

const router = express.Router();
const basePath = '/event'

router.get("/all", async (req, res) => {
    const events = await Event_Controller.getAllEvents();
    res.json(events);
});

router.get("/own", async (req, res) => {
    try {
        const eventInfo = req.body
        eventInfo.nombreUsuario = req.session.user.nombreUsuario
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

router.post("", async (req, res) => {
    try {
        const eventInfo = req.body
        const event = await Event_Controller.createEvent(eventInfo);
        res.json(event);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});

router.post("/addUser", async (req, res) => {
    try {
        const eventInfo = req.body
        eventInfo.nombreHost = req.session.user.nombreUsuario
        const newUser = await Event_Controller.addUserToEvent(eventInfo);
        res.json(newUser);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});

router.put("", async (req, res) => {
    try {
        const eventInfo = req.body
        eventInfo.nombreUsuario = req.session.user.nombreUsuario
        const newEvent = await Event_Controller.updateEvent(eventInfo);
        res.json(newEvent);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});

router.delete("/user", async (req, res) => {
    try {
        const eventInfo = req.body
        eventInfo.nombreHost = req.session.user.nombreUsuario
        const deletedUser = await Event_Controller.deleteUserFromEvent(eventInfo);
        res.json(deletedUser);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});

router.delete("", async (req, res) => {
    try {
        const eventInfo = req.body
        eventInfo.nombreHost = req.session.user.nombreUsuario
        const deletedEvent = await Event_Controller.deleteEvent(eventInfo);
        res.json(deletedEvent);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});


module.exports = { router, basePath };


require("dotenv").config()
const express = require('express');
const jwt = require('jsonwebtoken')
const Provider_Controller = require('../controllers/provider_Controller');

const router = express.Router();
const basePath = '/provider'

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
    const providers = await Provider_Controller.getAllProviders();
    res.json(providers);
});

router.get("/providersOfEvent", authorization, async (req, res) => {
    try {
        const providerInfo = req.body
        providerInfo.nombreUsuario = req.nombreUsuario
        const services = await Provider_Controller.getProvidersOfAnEvent(providerInfo);
        res.json(services);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});

router.get("/eventsOfProvider", authorization, async (req, res) => {
    try {
        const providerInfo = req.body
        providerInfo.nombreUsuario = req.nombreUsuario
        const events = await Provider_Controller.getEventsOfAProvider(providerInfo);
        res.json(events);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});

router.get("/myServices", authorization, async (req, res) => {
    try {
        const providerInfo = req.body
        providerInfo.nombreUsuario = req.nombreUsuario
        const services = await Provider_Controller.getMyServices(providerInfo);
        res.json(services);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});

router.get("", authorization, async (req, res) => {
    try {
        const providerInfo = req.body
        providerInfo.nombreUsuario = req.nombreUsuario
        const provider = await Provider_Controller.getProviderInfo(providerInfo);
        res.json(provider);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});

router.post("/create", authorization, async (req, res) => {
    try {
        const providerInfo = req.body
        providerInfo.nombreUsuario = req.nombreUsuario
        const provider = await Provider_Controller.createProvider(providerInfo);
        res.json(provider);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});

router.post("/add", authorization, async (req, res) => {
    try {
        const providerInfo = req.body
        providerInfo.nombreUsuario = req.nombreUsuario
        const provider = await Provider_Controller.addProviderToEvent(providerInfo);
        res.json(provider);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});

router.put("/update", authorization, async (req, res) => {
    try {
        const providerInfo = req.body
        providerInfo.nombreUsuario = req.nombreUsuario
        const provider = await Provider_Controller.updateProvider(providerInfo);
        res.json(provider);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});

router.delete("", authorization, async (req, res) => {
    try {
        const providerInfo = req.body
        providerInfo.nombreUsuario = req.nombreUsuario
        const provider = await Provider_Controller.deleteProvider(providerInfo);
        res.json(provider);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});

router.delete("/event", authorization, async (req, res) => {
    try {
        const providerInfo = req.body
        providerInfo.nombreUsuario = req.nombreUsuario
        const provider = await Provider_Controller.deleteProviderFromEvent(providerInfo);
        res.json(provider);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});



module.exports = { router, basePath };
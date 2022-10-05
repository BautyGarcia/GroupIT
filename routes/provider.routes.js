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
      req.mail = data.mail;
      return next();
    } catch {
      return res.sendStatus(403);
    }
};

//----------Routes------------

router.get("/all", async (req, res) => {
    try {
        const providers = await Provider_Controller.getAllProviders();
        return res.json(providers);
    }
    catch (err) {
        console.error(err.message);
        return res.status(400).json({ message: 'Could not get all providers'});
    }
});

router.get("/providersOfEvent", authorization, async (req, res) => {
    const providerInfo = req.body
    providerInfo.nombreUsuario = req.nombreUsuario

    try {
        const services = await Provider_Controller.getProvidersOfAnEvent(providerInfo);
        return res.json(services);
    }
    catch (err) {
        console.error(err.message);
        return res.status(400).json({ message: 'Could not get providers of an event'});
    }
});

router.get("/eventsOfProvider", authorization, async (req, res) => {
    const providerInfo = req.body
    providerInfo.nombreUsuario = req.nombreUsuario

    try {
        const events = await Provider_Controller.getEventsOfAProvider(providerInfo);
        return res.json(events);
    }
    catch (err) {
        console.error(err.message);
        return res.status(400).json({ message: 'Could not get events of a provider'});
    }
});

router.get("/myServices", authorization, async (req, res) => {
    const providerInfo = req.body
    providerInfo.nombreUsuario = req.nombreUsuario

    try {
        const services = await Provider_Controller.getMyServices(providerInfo);
        return res.json(services);
    }
    catch (err) {
        console.error(err.message);
        return res.status(400).json({ message: 'Could not get my services'});
    }
});

router.get("", authorization, async (req, res) => {
    const providerInfo = req.body
    providerInfo.nombreUsuario = req.nombreUsuario

    try {
        const provider = await Provider_Controller.getProviderInfo(providerInfo);
        return res.json(provider);
    }
    catch (err) {
        console.error(err.message);
        return res.status(400).json({ message: 'Could not get provider info'});
    }
});

router.post("/create", authorization, async (req, res) => {
    const providerInfo = req.body
    providerInfo.nombreUsuario = req.nombreUsuario

    try {
        const provider = await Provider_Controller.createProvider(providerInfo);
        return res.json(provider);
    }
    catch (err) {
        console.error(err.message);
        return res.status(400).json({ message: 'Could not create provider'});
    }
});

router.post("/add", authorization, async (req, res) => {
    const providerInfo = req.body
    providerInfo.nombreUsuario = req.nombreUsuario

    try {
        const provider = await Provider_Controller.addProviderToEvent(providerInfo);
        return res.json(provider);
    }
    catch (err) {
        console.error(err.message);
        return res.status(400).json({ message: 'Could not add provider to event'});
    }
});

router.put("/update", authorization, async (req, res) => {
    const providerInfo = req.body
    providerInfo.nombreUsuario = req.nombreUsuario

    try {
        const provider = await Provider_Controller.updateProvider(providerInfo);
        return res.json(provider);
    }
    catch (err) {
        console.error(err.message);
        return res.status(400).json({ message: 'Could not update provider'});
    }
});

router.delete("", authorization, async (req, res) => {
    const providerInfo = req.body
    providerInfo.nombreUsuario = req.nombreUsuario

    try {
        const provider = await Provider_Controller.deleteProvider(providerInfo);
        return res.json(provider);
    }
    catch (err) {
        console.error(err.message);
        return res.status(400).json({ message: 'Could not delete provider'});
    }
});

router.delete("/event", authorization, async (req, res) => {
    const providerInfo = req.body
    providerInfo.nombreUsuario = req.nombreUsuario

    try {
        const provider = await Provider_Controller.deleteProviderFromEvent(providerInfo);
        return res.json(provider);
    }
    catch (err) {
        console.error(err.message);
        return res.status(400).json({ message: 'Could not delete provider from event'});
    }
});



module.exports = { router, basePath };
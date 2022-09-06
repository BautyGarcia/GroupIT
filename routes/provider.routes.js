const express = require('express');
const Provider_Controller = require('../controllers/provider_Controller');

const router = express.Router();
const basePath = '/provider'

router.get("/all", async (req, res) => {
    const providers = await Provider_Controller.getAllProviders();
    res.json(providers);
});

router.get("/providersOfEvent", async (req, res) => {
    try {
        const providerInfo = req.body
        providerInfo.nombreUsuario = req.session.user.nombreUsuario
        const services = await Provider_Controller.getProvidersOfAnEvent(providerInfo);
        res.json(services);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});

router.get("/eventsOfProvider", async (req, res) => {
    try {
        const providerInfo = req.body
        providerInfo.nombreUsuario = req.session.user.nombreUsuario
        const events = await Provider_Controller.getEventsOfAProvider(providerInfo);
        res.json(events);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});

router.get("/myServices", async (req, res) => {
    try {
        const providerInfo = req.body
        providerInfo.nombreUsuario = req.session.user.nombreUsuario
        const services = await Provider_Controller.getMyServices(providerInfo);
        res.json(services);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});

router.get("", async (req, res) => {
    try {
        const providerInfo = req.body
        providerInfo.nombreUsuario = req.session.user.nombreUsuario
        const provider = await Provider_Controller.getProviderInfo(providerInfo);
        res.json(provider);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});

router.post("/create", async (req, res) => {
    try {
        const providerInfo = req.body
        providerInfo.nombreUsuario = req.session.user.nombreUsuario
        const provider = await Provider_Controller.createProvider(providerInfo);
        res.json(provider);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});

router.post("/add", async (req, res) => {
    try {
        const providerInfo = req.body
        providerInfo.nombreUsuario = req.session.user.nombreUsuario
        const provider = await Provider_Controller.addProviderToEvent(providerInfo);
        res.json(provider);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});

router.put("/update", async (req, res) => {
    try {
        const providerInfo = req.body
        providerInfo.nombreUsuario = req.session.user.nombreUsuario
        const provider = await Provider_Controller.updateProvider(providerInfo);
        res.json(provider);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});

router.delete("", async (req, res) => {
    try {
        const providerInfo = req.body
        providerInfo.nombreUsuario = req.session.user.nombreUsuario
        const provider = await Provider_Controller.deleteProvider(providerInfo);
        res.json(provider);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});

router.delete("/event", async (req, res) => {
    try {
        const providerInfo = req.body
        providerInfo.nombreUsuario = req.session.user.nombreUsuario
        const provider = await Provider_Controller.deleteProviderFromEvent(providerInfo);
        res.json(provider);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});



module.exports = { router, basePath };
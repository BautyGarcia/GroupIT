const express = require('express');
const Provider_Controller = require('../controllers/provider_Controller');

const router = express.Router();
const basePath = '/provider'

router.get("/all", async (req, res) => {
    const providers = await Provider_Controller.getAllProviders();
    res.json(providers);
});

module.exports = { router, basePath };
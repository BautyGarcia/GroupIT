const express = require('express');
const itemList_Controller = require('../controllers/itemList_Controller');

const router = express.Router();
const basePath = '/itemList'




module.exports = { router, basePath };

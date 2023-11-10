//js
const express = require('express');
const { ElecteurView } = require('../controllers/electeurController');
const electeurRouter = express.Router();
electeurRouter.get('/liste-electorale', ElecteurView);
module.exports = electeurRouter;
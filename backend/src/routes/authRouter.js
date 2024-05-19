const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/auth.controller.js');

authRouter.get('/getUser', authController.getUser);
authRouter.post('/loginUser', authController.loginUser);

module.exports = authRouter;
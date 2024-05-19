const express = require('express');
const indexRouter = express.Router();

const authRouter = require("./authRouter.js");
const dbRouter = require("./dbRouter.js");

indexRouter.use(authRouter);
indexRouter.use(dbRouter);

module.exports = indexRouter;
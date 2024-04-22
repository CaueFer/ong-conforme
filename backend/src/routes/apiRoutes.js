
const express = require('express');
const router = express.Router();
const mysqlController = require('../controllers/mysql.controller.js');


router.get('/getData', mysqlController.getData);

router.post('/addData', mysqlController.addData);

router.post('/updateData', mysqlController.updateData);

router.post('/deleteData', mysqlController.deleteData);

module.exports = router;
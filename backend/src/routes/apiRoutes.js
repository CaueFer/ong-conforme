
const express = require('express');
const router = express.Router();
const mysqlController = require('../controllers/mysql.controller.js');


router.get('/getData', mysqlController.getData);

router.post('/addData', mysqlController.addDoacao);

router.post('/addData', mysqlController.addHistorico);

router.post('/updateData', mysqlController.updateDoacao);

router.post('/deleteData', mysqlController.deleteData);

module.exports = router;

const express = require('express');
const router = express.Router();
const mysqlController = require('../controllers/mysql.controller.js');


router.get('/getDoacao', mysqlController.getDoacao);

router.post('/addDoacao', mysqlController.addDoacao);

router.post('/addHistorico', mysqlController.addHistorico);

router.post('/updateDoacao', mysqlController.updateDoacao);

router.post('/deleteDoacao', mysqlController.deleteDoacao);

module.exports = router;
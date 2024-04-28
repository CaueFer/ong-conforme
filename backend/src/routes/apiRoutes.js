
const express = require('express');
const router = express.Router();
const mysqlController = require('../controllers/mysql.controller.js');


router.get('/getDoacao', mysqlController.getDoacao);

router.post('/addDoacao', mysqlController.addDoacao);

router.post('/addHistorico', mysqlController.addHistorico);

router.post('/updateQntdInDoacao', mysqlController.updateQntdInDoacao);

router.post('/deleteDoacao', mysqlController.deleteDoacao);

router.post('/deleteHistorico', mysqlController.deleteHistorico);

module.exports = router;
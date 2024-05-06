
const express = require('express');
const router = express.Router();
const mysqlController = require('../controllers/mysql.controller.js');


router.get('/getDoacao', mysqlController.getDoacao);

router.get('/getSingleDoacao', mysqlController.getSingleDoacao);

router.get('/getUser', mysqlController.getUser);

router.get('/getHistorico', mysqlController.getHistorico);

router.post('/loginUser', mysqlController.loginUser);

router.post('/addDoacao', mysqlController.addDoacao);

router.post('/addHistorico', mysqlController.addHistorico);

router.post('/updateQntdInDoacao', mysqlController.updateQntdInDoacao);

router.post('/updateMetaInDoacao', mysqlController.updateMetaInDoacao);

router.post('/updateDoacao', mysqlController.updateDoacao);

router.post('/deleteDoacao', mysqlController.deleteDoacao);

router.post('/deleteMultiHistorico', mysqlController.deleteMultiHistorico);

router.post('/deleteSingleHistorico', mysqlController.deleteSingleHistorico);

module.exports = router;
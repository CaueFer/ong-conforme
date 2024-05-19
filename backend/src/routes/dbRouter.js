const express = require('express');
const dbRouter = express.Router();
const mysqlController = require('../controllers/mysql.controller.js');

dbRouter.get('/getDoacao', mysqlController.getDoacao);

dbRouter.get('/getSingleDoacao', mysqlController.getSingleDoacao);

dbRouter.get('/getHistorico', mysqlController.getHistorico);

dbRouter.get('/getFamilias', mysqlController.getFamilias);

dbRouter.get('/getTableLength', mysqlController.getTableLength);

dbRouter.get('/getMetaFixa', mysqlController.getMetaFixa);

dbRouter.get('/getHistoricoByCategoria', mysqlController.getHistoricoByCategoria);

dbRouter.post('/addDoacao', mysqlController.addDoacao);

dbRouter.post('/addHistorico', mysqlController.addHistorico);

dbRouter.post('/updateQntdInDoacao', mysqlController.updateQntdInDoacao);

dbRouter.post('/updateMetaInDoacao', mysqlController.updateMetaInDoacao);

dbRouter.post('/updateDoacao', mysqlController.updateDoacao);

dbRouter.post('/deleteDoacao', mysqlController.deleteDoacao);

dbRouter.post('/deleteMultiHistorico', mysqlController.deleteMultiHistorico);

dbRouter.post('/deleteSingleHistorico', mysqlController.deleteSingleHistorico);

module.exports = dbRouter;
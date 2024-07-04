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

dbRouter.post('/addFamilia', mysqlController.addFamilia);

dbRouter.post('/addAddress', mysqlController.addAddress);

dbRouter.post('/addMemberToFamilia', mysqlController.addMemberToFamilia);

dbRouter.put('/updateQntdInDoacao', mysqlController.updateQntdInDoacao);

dbRouter.put('/updateMetaInDoacao', mysqlController.updateMetaInDoacao);

dbRouter.put('/updateDoacao', mysqlController.updateDoacao);

dbRouter.put('/updateMetaFixa', mysqlController.updateMetaFixa);

dbRouter.delete('/deleteDoacao', mysqlController.deleteDoacao);

dbRouter.delete('/deleteMultiHistorico', mysqlController.deleteMultiHistorico);

dbRouter.delete('/deleteSingleHistorico', mysqlController.deleteSingleHistorico);

dbRouter.delete('/deleteFamilyById', mysqlController.deleteFamilyById);

module.exports = dbRouter;
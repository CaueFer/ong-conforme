const db = require('../db');
const config = require('./config.json');

let doacaoTable = 'doacoes';
let historicoTable = 'historicos';

exports.getData = (req, res) => {
  db.query('SELECT * FROM '+doacaoTable, (error, results, fields) => {
    if (error) {
      console.error('Erro ao obter dados do MySQL:', error);
      res.status(500).json("Erro ao obter os dados do MySQL");
      return;
    }
    res.send(results);
  });
};

exports.addData = (req, res) => {
  const data = req.body;
  db.query('INSERT INTO sua_tabela SET ?', data, (error, results, fields) => {
    if (error) {
      console.error('Erro ao adicionar dados ao MySQL:', error);
      res.status(500).json("Erro ao adicionar dados ao MySQL");
      return;
    }
    res.status(201).json("Dados adicionados com sucesso ao MySQL");
  });
};

exports.updateData = (req, res) => {
  const { id } = req.body;
  const newData = req.body;
  db.query('UPDATE sua_tabela SET ? WHERE id = ?', [newData, id], (error, results, fields) => {
    if (error) {
      console.error('Erro ao atualizar dados no MySQL:', error);
      res.status(500).json("Erro ao atualizar dados no MySQL");
      return;
    }
    res.status(200).json("Dados atualizados com sucesso no MySQL");
  });
};

// Controlador para deletar dados no MySQL
exports.deleteData = (req, res) => {
  const { id } = req.body;
  db.query('DELETE FROM sua_tabela WHERE id = ?', id, (error, results, fields) => {
    if (error) {
      console.error('Erro ao deletar dados do MySQL:', error);
      res.status(500).json("Erro ao deletar dados do MySQL");
      return;
    }
    res.status(200).json("Dados deletados com sucesso do MySQL");
  });
};

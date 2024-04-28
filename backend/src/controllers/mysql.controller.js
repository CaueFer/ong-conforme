const db = require("../db");
const config = require("../../../config");

let doacaoTable = "doacoes";
let historicoTable = "historico";

exports.getDoacao = (req, res) => {
  db.query("SELECT * FROM " + doacaoTable, (error, results, fields) => {
    if (error) {
      console.error("Erro ao obter dados :", error);
      res.status(500).json("Erro ao obter os dados ");
      return;
    }
    res.send(results);
  });
};

exports.addDoacao = (req, res) => {
  const data = req.body;
  db.query(
    "INSERT INTO " + doacaoTable + " SET ?",
    data,
    (error, results, fields) => {
      if (error) {
        console.error("Erro ao adicionar doacao ao MySQL:", error);
        res.status(500).json("Erro ao adicionar doacao ao MySQL");
        return;
      }
      const doacaoId = results.insertId;
      res
        .status(201)
        .json({ message: "Doacao adicionada com sucesso ao MySQL", doacaoId });
    }
  );
};

exports.addHistorico = (req, res) => {
  const data = req.body;
  db.query(
    "INSERT INTO " + historicoTable + " SET ?",
    data,
    (error, results, fields) => {
      if (error) {
        console.error("Erro ao adicionar historico ao MySQL:", error);
        res.status(500).json("Erro ao adicionar historico ao MySQL");
        return;
      }
      res.status(201).json("Historico adicionado com sucesso ao MySQL");
    }
  );
};

exports.updateQntdInDoacao = (req, res) => {
  const { qntd, tipoMov, doacao_id } = req.body;

  const quantidadeNova = parseInt(qntd, 10);

  db.query(
    "SELECT qntd FROM " + doacaoTable + " WHERE id = ?",
    doacao_id,
    (error, results) => {
      if (error) {
        console.error(
          "Erro ao consultar quantidade atual do item no MySQL:",
          error
        );
        res
          .status(500)
          .json("Erro ao consultar quantidade atual do item no MySQL");
        return;
      }

      if (results.length === 0) {
        res.status(404).json("Item não encontrado no banco de dados");
        return;
      }

      const quantidadeAtual = results[0].qntd;

      // MODIFICA QUANTIDADE / ENTRADA OU SAIDA
      let novaQuantidade;
      if (tipoMov === "entrada") {
        novaQuantidade = quantidadeAtual + quantidadeNova;
      } else if (tipoMov === "saida") {
        novaQuantidade = quantidadeAtual - quantidadeNova;
      }
      if (novaQuantidade < 0) novaQuantidade = 0;

      db.query(
        "UPDATE " + doacaoTable + " SET qntd = ? WHERE id = ?",
        [novaQuantidade, doacao_id],
        (error, results) => {
          if (error) {
            console.error(
              "Erro ao atualizar quantidade do item no MySQL:",
              error
            );
            res
              .status(500)
              .json("Erro ao atualizar quantidade do item no MySQL");
            return;
          }

          res
            .status(200)
            .json("Quantidade do item atualizada com sucesso no MySQL");
        }
      );
    }
  );
};

exports.deleteDoacao = (req, res) => {
  const { id } = req.body;

  db.query(
    "DELETE FROM " + doacaoTable + " WHERE id = ?",
    id,
    (error, results, fields) => {
      if (error) {
        console.error("Erro ao deletar doacao :", error);
        res.status(500).json("Erro ao deletar doacao ");
        return;
      }
      res.status(200).json("Doacao deletado com sucesso ");
    }
  );
};

exports.deleteHistorico = (req, res) => {
  const { id } = req.body;

  db.query(
    "DELETE FROM " + historicoTable + " WHERE doacao_id = ?",
    id,
    (error, results, fields) => {
      if (error) {
        console.error("Erro ao deletar historico :", error);
        res.status(500).json("Erro ao deletar historico ");
        return;
      }
      res.status(200).json("Historico deletado com sucesso ");
    }
  );
}

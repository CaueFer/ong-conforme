const db = require("../db");
const config = require("../../../config");

let doacaoTable = config.doacoesTable;
let historicoTable = config.historicosTable;
let familyTable = config.familiaTable;
let metaFixaTable = config.metaFixaTable;
let addressTable = config.enderecoTable;
let memberTable = config.memberTable;

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

exports.getSingleDoacao = (req, res) => {
  const id = req.query.id;

  db.query(
    "SELECT * FROM " + doacaoTable + " WHERE id = ?",
    id,
    (error, results, fields) => {
      if (error) {
        console.error("Erro ao obter dados:", error);
        res.status(500).json("Erro ao obter os dados");
        return;
      }
      res.status(200).json(results);
    }
  );
};

exports.getHistorico = (req, res) => {
  db.query("SELECT * FROM " + historicoTable, (error, results, fields) => {
    if (error) {
      console.error("Erro ao obter historicos :", error);
      res.status(500).json("Erro ao obter os historicos ");
      return;
    }
    res.send(results);
  });
};

exports.getFamilias = (req, res) => {
  db.query("SELECT * FROM " + familyTable, (error, results, fields) => {
    if (error) {
      console.error("Erro ao obter familias :", error);
      res.status(500).json("Erro ao obter os familias ");
      return;
    }
    res.send(results);
  });
};

exports.getTableLength = (req, res) => {
  db.query(
    `
    SELECT
      (SELECT COUNT(*) FROM ${familyTable}) AS total_familias,
      (SELECT COUNT(*) FROM ${doacaoTable}) AS total_doacoes,
      (SELECT COUNT(*) FROM ${historicoTable}) AS total_historicos
  `,
    (error, results, fields) => {
      if (error) {
        console.error(
          "Erro ao obter o número de registros das tabelas:",
          error
        );
        res.status(500).json("Erro ao obter o número de registros das tabelas");
        return;
      }
      const tableLengths = {
        totalFamilias: results[0].total_familias,
        totalDoacoes: results[0].total_doacoes,
        totalHistoricos: results[0].total_historicos,
      };
      res.json(tableLengths);
    }
  );
};

exports.getMetaFixa = (req, res) => {
  const id = req.query.id;

  db.query(
    "SELECT * FROM " + metaFixaTable + " WHERE id = ?",
    id,
    (error, results, fields) => {
      if (error) {
        console.error("Erro ao obter dados:", error);
        res.status(500).json("Erro ao obter os dados");
        return;
      }
      res.status(200).json(results);
    }
  );
};

exports.getHistoricoByCategoria = (req, res) => {
  const categoria = req.query.categoria;

  const query = `
    SELECT ${historicoTable}.*
    FROM ${historicoTable}
    JOIN ${doacaoTable} ON ${historicoTable}.doacao_id = ${doacaoTable}.id
    WHERE ${doacaoTable}.categoria = ?;
  `;

  db.query(query, [categoria], (error, results) => {
    if (error) {
      console.error("Erro ao obter histórico por categoria:", error);
      res.status(500).json("Erro ao obter histórico por categoria");
      return;
    }
    res.json(results);
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

exports.addAddress = (req, res) => {
  const { street, number, neighborhood, city, state, zipcode, complement } =
    req.body;

  const checkQuery = `SELECT * FROM ${addressTable} WHERE street = ? AND number = ? AND neighborhood = ? AND city = ? AND state = ? AND zipcode = ?`;
  db.query(
    checkQuery,
    [street, number, neighborhood, city, state, zipcode],
    (err, results) => {
      if (results.length > 0) {
        return res.status(200).send({ id: results[0].endereco_id });
      } else {
        const insertQuery = `INSERT INTO ${addressTable} (street, number, neighborhood, city, state, zipcode, complemento) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        db.query(
          insertQuery,
          [street, number, neighborhood, city, state, zipcode, complement],
          (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).send(err);
            }
            res.status(201).send({ id: result.insertId });
          }
        );
      }
    }
  );
};

exports.addFamilia = (req, res) => {
  const {
    respName,
    respSobrenome,
    respCpf,
    respEmail,
    respTelefone,
    familyDesc,
    endereco_id,
  } = req.body;

  const query = `INSERT INTO ${familyTable} (resp_name, resp_sobrenome, resp_cpf, resp_email, resp_telefone, familyDesc, endereco_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.query(
    query,
    [
      respName,
      respSobrenome,
      respCpf,
      respEmail,
      respTelefone,
      familyDesc,
      endereco_id,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
      res.status(201).send({ id: result.insertId });
    }
  );
};

exports.addMemberToFamilia = async (req, res) => {
  try {
    const { familyId, newMembers } = req.body;
    const familia_id = familyId;

    const values = newMembers.map((member) => [
      familia_id,
      member.membro,
      member.genero,
      member.idade,
    ]);

    const query = `INSERT INTO ${memberTable} (familia_id, membro, genero, idade) VALUES ?`;
    const result = await db.query(query, [values]);

    res.status(201).send({ affectedRows: result.affectedRows });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
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

exports.updateMetaInDoacao = (req, res) => {
  const { metaQntd, metaDate, doacao_id } = req.body;

  let qntdNova = null;
  if (metaQntd) qntdNova = parseInt(metaQntd, 10);

  db.query(
    "UPDATE " + doacaoTable + " SET metaQntd = ?, metaDate = ? WHERE id = ?",
    [qntdNova, metaDate, doacao_id],
    (error, results) => {
      if (error) {
        console.error("Erro ao atualizar meta do item:", error);
        res.status(500).json("Erro ao atualizar meta do item");
        return;
      }

      res.status(200).json("Meta do item atualizada com sucesso");
    }
  );
};

exports.updateDoacao = (req, res) => {
  const { id, categoria, itemName } = req.body;

  db.query(
    "UPDATE " + doacaoTable + " SET categoria = ?, itemName = ? WHERE id = ?",
    [categoria, itemName, id],
    (error, results) => {
      if (error) {
        console.error("Erro ao atualizar doacao:", error);
        res.status(500).json("Erro ao atualizar doacao");
        return;
      }
      res.status(200).json("Doacao atualizada com sucess");
    }
  );
};

exports.updateMetaFixa = (req, res) => {
  const { id, nome, qntdMetaAll } = req.body;

  db.query(
    "UPDATE " + metaFixaTable + " SET nome = ?, qntdMetaAll = ? WHERE id = ?",
    [nome, qntdMetaAll, id],
    (error, results) => {
      if (error) {
        console.error("Erro ao atualizar meta fixa:", error);
        res.status(500).json("Erro ao atualizar meta fixa");
        return;
      }
      res.status(200).json("Meta fixa atualizada com sucesso");
    }
  );
};

exports.deleteDoacao = (req, res) => {
  const id = req.query.id;

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

exports.deleteMultiHistorico = (req, res) => {
  const id = req.query.id;

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
};

exports.deleteSingleHistorico = (req, res) => {
  const id = req.query.id;

  db.query(
    "DELETE FROM " + historicoTable + " WHERE id = ?",
    id,
    (error, results, fields) => {
      if (error) {
        console.error("Erro ao deletar historico individual :", error);
        res.status(500).json("Erro ao deletar historico individual");
        return;
      }
      res.status(200).json("Historico individual deletado com sucesso ");
    }
  );
};

exports.deleteFamilyById = (req, res) => {
  const familyId = req.query.id;

  const selectQuery = `SELECT id FROM ${memberTable} WHERE familia_id = ?`;

  db.query(selectQuery, [familyId], (error, results, fields) => {
    if (error) {
      console.error("Erro ao selecionar membros da família:", error);
      res.status(500).json("Erro ao selecionar membros da família");
      return;
    }
    const memberIds = results.map((result) => result.id);

    const deleteMembersQuery = `DELETE FROM ${memberTable} WHERE familia_id = ?`;

    db.query(deleteMembersQuery, [familyId], (error, results, fields) => {
      if (error) {
        console.error("Erro ao deletar membros da família:", error);
        res.status(500).json("Erro ao deletar membros da família");
        return;
      }

      const deleteFamilyQuery = `DELETE FROM ${familyTable} WHERE id = ?`;

      db.query(deleteFamilyQuery, [familyId], (error, results, fields) => {
        if (error) {
          console.error("Erro ao deletar família:", error);
          res.status(500).json("Erro ao deletar família");
          return;
        }

        res.status(200).json("Família deletada com sucesso");
      });
    });
  });
};

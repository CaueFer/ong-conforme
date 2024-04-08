const { google } = require("googleapis");
const { getAuthSheets } = require("./database-connection.js");

async function getDatabase(req, res) {
  try {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    const metadata = await googleSheets.spreadsheets.get({
      auth,
      spreadsheetId,
    });

    res.send(metadata.data);
  } catch (error) {
    res.status(500).json("Erro ao obter o banco de dados");
  }
}

async function getData(req, res) {
  try {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    const getRows = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "default",
      valueRenderOption: "UNFORMATTED_VALUE",
      dateTimeRenderOption: "FORMATTED_STRING",
    });

    res.send(getRows.data);
  } catch (error) {
    res.status(500).json("Erro ao obter os dados");
  }
}

async function addData(req, res) {
  try {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();
    const values = req.body;

    const response = await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: "default!A:Z",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: values,
      },
    });

    res.status(201).json("Valor adicionado");
  } catch (error) {
    res.status(500).json("Erro ao adicionar valor");
  }
}

async function updateValue(req, res) {
  try {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    const values = req.body;

    const updateValue = await googleSheets.spreadsheets.values.update({
      auth,
      spreadsheetId,
      range: "default!A3",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: values,
      },
    });

    res.status(205).json("Valor atualizado");
  } catch (error) {
    res.status(500).json("Erro ao atualizar valor");
  }
}

async function deleteValue(req, res) {
  try {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    const valueIndex = req.body.valueIndex;
    const rangeString = `default!${valueIndex}:${valueIndex}`;

    const deleteValue = await googleSheets.spreadsheets.values.clear({
      auth,
      spreadsheetId,
      range: rangeString,
    });

    res.status(205).json("Valor deletado");
  } catch (error) {
    res.status(500).json("Erro ao deletar valor");
  }
}

module.exports = { getDatabase, getData, addData, updateValue, deleteValue };

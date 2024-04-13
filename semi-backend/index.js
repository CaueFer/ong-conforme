const express = require("express");
const cors = require("cors");
const req = require("express/lib/request");
const { google } = require("googleapis");

const app = express();

app.use(express.json());
app.use(cors());

async function getAuthSheets() {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();

  const googleSheets = google.sheets({
    version: "v4",
    auth: client,
  });

  const spreadsheetId = "1gEnhslT8NEzlZwF6FPc5VvK6KxEhh2dMW_tl0jxF3X4";

  return {
    auth,
    client,
    googleSheets,
    spreadsheetId,
  };
}

app.get("/getData", async (req, res) => {
  const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

  const metadata = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });

  res.send(metadata.data);
});

app.get("/getRows", async (req, res) => {
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
});

app.post("/addRow", async (req, res) => {
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
});

app.post("/updateValue", async (req, res) => {
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
});

app.post("/deleteValue", async (req,res) => {
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
})

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));

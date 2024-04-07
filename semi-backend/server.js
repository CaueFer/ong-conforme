const express = require("express");
const req = require("express/lib/request");
const { google } = require("googleapis");
const { DoacaoModel } = require("./models/doacao.model.ts");

const app = express();
app.use(express.json());

async function getAuthSheets() {
  const auth = new google.auth.GoogleAuth({
    keyFile: "./semi-backend/keygoogle.json",
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
  const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "default",
    valueRenderOption: "UNFORMATTED_VALUE",
    dateTimeRenderOption: "FORMATTED_STRING",
  });

  res.send(getRows.data);
});

app.post("/addRow", async (req, res) => {
  const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

  const { values } = req.body;

  const row = await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "default",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: values, 
    },
  });

  res.send(row.data);
});

app.post("/updateValue", async (req, res) => {
  const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

  const doacaoModel = new DoacaoModel({
    objeto: req.body.objeto,
    qntd: req.body.qntd,
    historico: req.body.historico,
  });
  const { values } = doacaoModel;

  const updateValue = await googleSheets.spreadsheets.values.update({
    spreadsheetId,
    range: "Página1!A2:C2",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: values,
    },
  });

  res.send(updateValue.data);
});

app.listen(5050, () => console.log("on port: 5050"));

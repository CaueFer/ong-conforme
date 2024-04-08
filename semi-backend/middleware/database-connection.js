const { google } = require("googleapis");

async function getAuthSheets() {
    const auth = new google.auth.GoogleAuth({
      keyFile: "keygoogle.json",
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

module.exports = { getAuthSheets };
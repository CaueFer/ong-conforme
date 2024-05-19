const db = require("../db");
const config = require("../../../config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

let doacaoTable = config.doacoesTable;
let historicoTable = config.historicosTable;
let userTable = config.userTable;
let familyTable = config.familyTable;
let metaFixaTable = config.metaFixaTable;

const secretKey = "STRINGMTFODA";

exports.getUser = (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      message: "Token not provided",
    });
  }

  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Invalid jwt",
      });
    }

    if (decoded) {
      res.status(200).json({
        userInfos: {
          name: decoded.userName,
          email: decoded.userEmail,
          roles: decoded.userRoles,
        },
      });
    }
  });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  db.query(
    "SELECT * FROM " + userTable + " WHERE email = ?",
    [email],
    async (error, results, fields) => {
      if (error) {
        console.error("Erro ao validar login: ", error);
        res.status(500).json("Erro ao validar login.");
        return;
      }
      if (results.length === 0) {
        res.status(404).json("Conta não encontrada.");
        return;
      }

      const user = results[0];
      if (user) {
        const userPass = user.passwordHash;
        const passwordMatch = await bcrypt.compare(password, userPass);

        if (!passwordMatch) {
          return res.status(406).json("Senha incorreta.");
        }

        const token = jwt.sign(
          {
            userName: user.userName,
            userEmail: user.email,
            userId: user.id,
            userRoles: user.roles,
          },
          secretKey,
          { expiresIn: "24h" }
        );
        res.status(200).json({
          token: token,
          expiresIn: 86400,
          message: "Login efetuado com sucesso.",
        });
      }
    }
  );
};

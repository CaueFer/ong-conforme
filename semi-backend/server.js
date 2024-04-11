const express = require("express");
const cors = require("cors");
const routes = require("./routes/main-routes.js");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", routes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
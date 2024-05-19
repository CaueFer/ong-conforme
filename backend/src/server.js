const express = require("express");
const cors = require("cors");
const indexRouter = require("./routes/indexRouter.js");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", indexRouter);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));

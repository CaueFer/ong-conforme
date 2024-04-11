const express = require("express");
const router = express.Router();
const { getDatabase, getData, addData, updateValue, deleteValue } = require("../middleware/controllers.js");

router.get("/getDatabase", getDatabase);
router.get("/getData", getData);
router.post("/addData", addData);
router.post("/updateValue", updateValue);
router.post("/deleteValue", deleteValue);

module.exports = router;
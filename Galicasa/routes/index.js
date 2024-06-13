var express = require("express");
var router = express.Router();
const indexController = require("../controllers/indexController");

// listado de todas las inmobiliarias y top propiedades
router.get("/", indexController.viewHome);

module.exports = router;

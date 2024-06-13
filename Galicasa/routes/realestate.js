var express = require("express");
var router = express.Router();
const multer = require("../middlewares/multer");

const realestateController = require("../controllers/realestateController");

//vista de todas las inmobiliarias
router.get("/", realestateController.realstate);

//vista de una inmobiliaria y sus propiedades
router.get("/view/:id", realestateController.viewrealstate);

//registra una inmobiliaria
router.get("/register", realestateController.registerrealstate);

router.post("/register",multer("realestate"), realestateController.postregisterrealstate);

//login
router.get("/login", realestateController.loginrealstate);

router.post("/login", realestateController.postloginrealstate);

// vista de una inmobiliaria de sí misma
router.get("/adminrealestate/:id", realestateController.adminrealstate);

module.exports = router;

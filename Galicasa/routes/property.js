var express = require("express");
var router = express.Router();
const multer = require("../middlewares/multer");

const propertyController = require("../controllers/propertyController");

//ver todas las propiedades
router.get("/", propertyController.viewproperties);

//registrar una propiedad
router.get("/new/:id", propertyController.newproperty);

router.post("/new/:id", multer("property"), propertyController.postnewproperty);

//ver una propiedad
router.get("/view/:id", propertyController.viewproperty);

//editar una propiedad
router.get("/edit/:id", propertyController.editproperty);

router.post("/edit/:id",multer("property"), propertyController.posteditproperty);

//vender una propiedad
router.get("/sold/:id", propertyController.soldproperty);

//eliminar una propiedad
router.get("/delete/:id", propertyController.deleteproperty);


// //eliminar una propiedad//registrar una propiedad
// router.get("/logicdelete/:id", propertyController.logicdeleteproperty);

module.exports = router;

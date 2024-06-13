const connection = require("../config/db");
const bcrypt = require("bcrypt");
const sendMail = require("../services/emailService");

class RealestateController {
  //vista de todas las inmobiliarias
  realstate = (req, res) => {
    let sql = "SELECT * FROM real_estate";
    connection.query(sql, (err, result) => {
      if (err) throw err;
      res.render("realestate", { result });
    });
  };

  //vista de una inmobiliaria
  viewrealstate = (req, res) => {
    let id = req.params.id;
    let sql = `SELECT *, real_estate.realestate_id as id FROM real_estate LEFT JOIN property ON real_estate.realestate_id = property.realestate_id WHERE real_estate.realestate_id = ${id}`;
    connection.query(sql, (err, result) => {
      if (err) throw err;

      let properties = result.map((propiedad) => ({
        property_id: propiedad.property_id,
        city: propiedad.city,
        address: propiedad.address,
        construction_year: propiedad.construction_year,
        area: propiedad.area,
        price: propiedad.price,
        discount: propiedad.discount,
        description: propiedad.description,
        photo: propiedad.photo,
      }));

      let realestate = {
        id: id,
        username: result[0].username,
        email: result[0].email,
        phone: result[0].phone,
        biography: result[0].biography,
        avatar: result[0].avatar,
        properties,
      };

      res.render("viewrealestate", { realestate });
    });
  };

  //abre formulario de registro
  registerrealstate = (req, res) => {
    res.render("register");
  };

  //realiza el registro
  postregisterrealstate = (req, res) => {
    let { name, email, password, phone, about } = req.body;

    let message1 = "";
    let message2 = "";
    let message3 = "";
    let message4 = "";
    let validator = true;

    if (!name) {
      message1 = "Nombre requerido";
      validator = false;
    }
    if (!email) {
      message2 = "Email requerido";
      validator = false;
    }
    if (!password) {
      message3 = "Constraseña requerido";
      validator = false;
    }
    if (!phone) {
      message4 = "Teléfono requerido";
      validator = false;
    }
    if (!validator) {
      return res.render("register", { message1, message2, message3, message4 });
    }

    let saltRounds = 10;
    bcrypt.hash(password, saltRounds, (hashErr, hash) => {
      if (hashErr) throw hashErr;

      let insert = [name, email, hash, phone, about];
      let sql = `INSERT INTO real_estate (username, email, password, phone, biography) VALUES (?, ?, ?, ?,?)`;
      if (req.file) {
        insert.push(req.file.filename);
        sql = `INSERT INTO real_estate (username, email, password, phone, biography, avatar) VALUES (?, ?, ?, ?, ?, ?)`;
      }
      connection.query(sql, insert, (err, result) => {
        if (err) {
          if (err.errno == 1062) {
            res.render("register", { message3: "Email ya existe" });
          } else {
            throw err;
          }
        } else {
          sendMail(email, name);
          res.redirect(`/realestate/adminrealestate/${result.insertId}`);
        }
      });
    });
  };

  //abre formulario de login
  loginrealstate = (req, res) => {
    res.render("login");
  };

  //valida el login
  postloginrealstate = (req, res) => {
    let { email, password } = req.body;

    let insert = [email];
    let sql = `SELECT * from real_estate WHERE email = ?`;
    connection.query(sql, insert, (err, result) => {
      if (err) throw err;
      if (result[0]) {
        let hash = result[0].password;
        bcrypt.compare(password, hash, (errCompare, resultCompare) => {
          if (errCompare) throw errCompare;
          if (resultCompare) {
            res.redirect(
              `/realestate/adminrealestate/${result[0].realestate_id}`
            );
          } else {
            res.render("login", { message: "Acceso denegado" });
          }
        });
      } else if (!result[0]) {
        res.render("login", { message: "Acceso denegado" });
      }
    });
  };

  //administrador de inmobilaria
  adminrealstate = (req, res) => {
    let id = req.params.id;
    let properties =[];
    let sql = `SELECT *, city.city, real_estate.realestate_id as id FROM real_estate LEFT JOIN property ON real_estate.realestate_id = property.realestate_id JOIN city ON property.city_id = city.city_id WHERE real_estate.realestate_id = ${id}`;
    connection.query(sql, (err, result) => {
      if (err) throw err;
      if (!result.length) {
        sql = `SELECT * FROM real_estate  WHERE real_estate.realestate_id = ${id}`;
        connection.query(sql, (err, result) => {
          if (err) throw err;
          let realestate = {
            id: id,
            username: result[0].username,
            email: result[0].email,
            phone: result[0].phone,
            biography: result[0].biography,
            avatar: result[0].avatar,
            properties
          };
          res.render("adminrealestate", { realestate });
        });
      }else{
        properties = result.map((propiedad) => ({
        property_id: propiedad.property_id,
        city: propiedad.city,
        address: propiedad.address,
        construction_year: propiedad.construction_year,
        area: propiedad.area,
        price: propiedad.price,
        discount: propiedad.discount,
        sold: propiedad.is_sold,
        description: propiedad.description,
        photo: propiedad.photo,
      }));

      let realestate = {
        id: id,
        username: result[0].username,
        email: result[0].email,
        phone: result[0].phone,
        biography: result[0].biography,
        avatar: result[0].avatar,
        properties,
      };
      res.render("adminrealestate", { realestate });
    }
    });
  };
}

module.exports = new RealestateController();

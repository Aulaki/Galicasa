const connection = require("../config/db");

class PropertyController {
  //Ver todos los inmuebles
  viewproperties = (req, res) => {
    
    let order = "insertdata DESC";
    let city_id;
    if(req.query.city){
      city_id=req.query.city
    }
    if (req.query.orderby) {
      let prueba = req.query
      order = prueba.orderby.split("_")[1];
      city_id=prueba.orderby.split("_")[0]
    }
    let sql = `SELECT property.*, city.city FROM property, city  WHERE property.city_id = city.city_id and is_deleted = 0 and is_sold = 0 ORDER BY ${order}`;

    let city = null;
    if (city_id) {
      city = city_id


      // if(Array.isArray(req.query.city)){
      // city = req.query.city.join();
      // }
      sql = `SELECT property.*, city.city FROM property, city  WHERE property.city_id = city.city_id and is_deleted = 0 and is_sold = 0 and property.city_id IN (${city}) ORDER BY ${order}`;
    }

    connection.query(sql, (err, result) => {
      if (err) throw err;
      let properties = result;
      let realestate = {
        properties,
      };
      sql = `SELECT * FROM city ORDER BY province_id ASC`;
    connection.query(sql, (err, result) => {
      if (err) throw err;
        res.render("property", { realestate, result ,city_id});
      });
    });
  };

  //abrir formulario resgistrar inmueble
  newproperty = (req, res) => {
    let id = req.params.id
    let sql = `SELECT * FROM city ORDER BY city ASC`;
    connection.query(sql, (err, result) => {
      if (err) throw err;
    res.render("newproperty",{result, id});
  });
  };

  //registrar inmueble
  postnewproperty = (req, res) => {
    let id = req.params.id;
    let {city, address, year, area, price, about} = req.body
    let insert = [address, year, area, price, about, id];
    let sql = `INSERT INTO property (city_id, address, construction_year, area, price, description, realestate_id) VALUES ((SELECT city_id FROM city WHERE city LIKE '${city}'), ?, ?, ?, ?, ?, ?)`;
    if (req.file) {
      insert.push(req.file.filename);
      sql = `INSERT INTO property (city_id, address, construction_year, area, price, description, realestate_id, photo) VALUES ((SELECT city_id FROM city WHERE city LIKE '${city}'), ?, ?, ?, ?, ?, ?, ?)`;
    }
    connection.query(sql, insert, (err, result) => {
      if (err) throw err;
      res.redirect(`/realestate/adminrealestate/${id}`);
    });
  };

  //ver datos de un inmueble
  viewproperty = (req, res) => {
    let insert = [req.params.id];
    let sql = `SELECT * FROM property WHERE property_id = ? and is_deleted = 0 and is_sold = 0`;
    connection.query(sql, insert, (err, result) => {
      if (err) throw err;
      res.render("viewproperty", { property:result[0] });
    });
  };

//formulario para editar un inmueble
  editproperty = (req, res) => {
    let id = req.params.id
    let insert = [id];
    let sql = `SELECT property.*, city.city FROM property, city WHERE property.city_id = city.city_id and property_id = ? and is_deleted = 0 and is_sold = 0`;
    connection.query(sql, insert, (err, result) => {
      if (err) throw err;
      res.render("editproperty", { result, id });
    });
  };

  //guardamos edicion de inmueble
  posteditproperty = (req, res) => {
    let {about, price, discount} = req.body
    let property_id = req.params.id
    let insert = [about, price, discount];
    let sql = `SELECT * FROM property WHERE property_id = ${property_id} and is_deleted = 0`;
    connection.query(sql, insert, (err, resultselect) => {
      if (err) throw err;
    sql = `UPDATE property SET description = ?, price = ?, discount = ? WHERE property_id = ${property_id}`;
    if (req.file) {
      insert.push(req.file.filename);
      sql = `UPDATE property SET description = ?, price = ?, discount = ?, photo = ? WHERE property_id = ${property_id}`;
    } 
    connection.query(sql, insert, (err, result) => {
      if (err) throw err;
      console.log(resultselect)
    res.redirect(`/realestate/adminrealestate/${resultselect[0].realestate_id}`);
  })})
  };

  //eliminamos un inmueble de forma definitiva //el select esta para poder volver a la pagina admin(necesito recuperar el id de la inmobilaria)
  deleteproperty = (req, res) => {
    let insert = [req.params.id];
    let sql = `SELECT * FROM property WHERE property_id = ? and is_deleted = 0`;
    connection.query(sql, insert, (err, resultselect) => {
      if (err) throw err;
    let sql = `DELETE FROM property WHERE property_id = ?`;

    connection.query(sql, insert, (err, result) => {
      if (err) throw err;
      res.redirect(`/realestate/adminrealestate/${resultselect[0].realestate_id}`);
    });});
  };

//marca un inmueble como vendido //el select esta para poder volver a la pagina admin(necesito recuperar el id de la inmobilaria)
  soldproperty = (req, res) => {
    let insert = [req.params.id];
    let sql = `SELECT * FROM property WHERE property_id = ? and is_deleted = 0`;
    connection.query(sql, insert, (err, resultselect) => {
      if (err) throw err;

    sql = `UPDATE property SET is_sold = 1 WHERE property_id = ?`;

    connection.query(sql, insert, (err, result) => {
      if (err) throw err;
      res.redirect(`/realestate/adminrealestate/${resultselect[0].realestate_id}`);
    });
  });
  };

}

module.exports = new PropertyController();

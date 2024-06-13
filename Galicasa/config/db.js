const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'galicasa'
});

connection.connect(function(err){
    if(err){
        console.log(err);
        return;
    }
    console.log('Conectado a la db')
})
module.exports = connection;

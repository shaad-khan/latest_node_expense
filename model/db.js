var mysql = require('mysql')
var connection = mysql.createConnection({
  host     : 'csconnect.mysql.database.azure.com',//'localhost',
  user     : 'csconnect@csconnect',
  password : 'C0ntinu5erve',
  database : 'csintranet-test'
});

module.exports=connection

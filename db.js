var mysql      = require('mysql');

var connection = mysql.createConnection({
    host     : 'den1.mysql3.gear.host',
    user     : 'dsmhomedb1',
    password : 'Yc2HG-r2SRS-',
    database : 'dsmhomedb1'
  });

connection.connect();

global.db = connection;
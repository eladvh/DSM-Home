var mysql      = require('mysql');

var connection = mysql.createConnection({
    host     : "den1.mysql3.gear.host",
    user     : "dsmhomedb1",
    password : "Yc2HG-r2SRS-",
    database : "dsmhomedb1"
  });

connection.connect();

global.db = connection;

/*
create file named .env.default

NODE_ENV = development

DB_HOST =den1.mysql3.gear.host
DB_USER = dsmhomedb1
DB_PASSWORD = Yc2HG-r2SRS-
DB_NAME = dsmhomedb1*/



/*host     : process.env.DB_HOST,
user     : process.env.DB_USER,
password : process.env.DB_PASSWORD,
database : process.env.DB_NAME*/
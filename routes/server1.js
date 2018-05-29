/*var express = require('express');
var sql     = require('mssql');

const config = {
    user: 'dsmhomedb', 
    password: 'Vy93_r90pHY?', 
    server: 'den1.mssql4.gear.host', 
    database: 'dsmhomedb' 
};*/

//module.exports = config;

//instantiate a connection pool
//cp = new sql.ConnectionPool(config); //cp = connection pool
//var app = express();





//require route handlers and use the same connection pool everywhere
//var query = require('../routes/query')(cp);
//var set2    = require('./routes/set2')(cp);
//generic express stuff


//...
//app.get('/path1', set1.get);
//app.get('/path2', set2.get);
//var username = require('../routes/index').username;
//connect the pool and start the web server when done
/*

cp.connect().then(function() {
  console.log('Connection pool open for duty');
  
  //var request = new sql.Request(cp);
  
 
  /*request.query("INSERT INTO [Users] (Usermail, Userpassword) VALUES ('"+global.username+"', '"+global.password+"')").then(function(recordset) {
    //console.log('Recordset: ' + recordset);
    //console.log('Affected: ' + request.rowsAffected);
    console.log(recordset);
  });*/

  /*var request = new sql.Request(cp);
      request.query("select * from Users").then(function (recordSet) {
        console.log(recordSet);
      });*/

  /*var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

  });
}).catch(function(err) {
  console.error('Error creating connection pool', err);
}); */



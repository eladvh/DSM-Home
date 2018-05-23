var express = require('express');
var app = express();
var sql = require("mssql");
var fs = require ("fs");

console.log('lalaal');
/*
module.exports = function loadUsers() {
    var dbConn = new sql.ConnectionPool(dbConfig);
    dbConn.connect().then(function () {
        //var request = new sql.Request(dbConn);
        request.query("select * from Users").then(function (recordSet) {
            console.log(recordSet);
            dbConn.close();
        }).catch(function (err) {

            console.log(err);
            dbConn.close();
        });
    })
}
module.exports = loadUsers();  */


//request.query("INSERT INTO Users (Usermail, Userpassword) VALUES (?, ?)", [username, password]).then(function(recordset) {
    //console.log('Recordset: ' + recordset);
    //console.log('Affected: ' + request.rowsAffected);
  //})
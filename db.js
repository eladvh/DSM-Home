var express = require('express');
var app = express();
var sql = require("mssql");
var fs = require ("fs");

     //config for your database
    var dbConfig = {
        user: 'dsmhomedb', 
        password: 'Vy93_r90pHY?', 
        server: 'den1.mssql4.gear.host', 
        database: 'dsmhomedb' 
    };

    console.log('connected');

 /*   function loadUsers() {

        var dbConn = new sql.ConnectionPool(dbConfig);

        dbConn.connect().then(function () {

            //var request = new sql.Request(dbConn);
            //request.query("INSERT INTO Users (Usermail, Userpassword) VALUES (?, ?)", [username, password]).then(function(recordset) {
                //console.log('Recordset: ' + recordset);
                //console.log('Affected: ' + request.rowsAffected);
              //})
            request.query("select * from Users").then(function (recordSet) {
                console.log(recordSet);
                dbConn.close();
            }).catch(function (err) {

                console.log(err);
                dbConn.close();
            });
        }).catch(function (err) {

            console.log(err);
        });
    }
    loadUsers(); */
    //request.query("INSERT INTO Users (Usermail, Userpassword) VALUES ('ssssdd', 435735)").then(function(recordset) {
         //  console.log('Recordset: ' + recordset);
          // console.log('Affected: ' + request.rowsAffected);
        // })

    module.exports = Connection;
    


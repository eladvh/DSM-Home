var express = require('express');
var router = express.Router();
var sql = require('mysql');

var server = require('../routes/server.js');

/*
router.get('/login', function(req, res, next) {
  res.sendfile('public/login.html');

});*/
  

  /*router.post('/login', function(req, res, next) {
    req.checkBody('username' , 'Username field cannot be empty.').notEmpty();
    const errors = req.validationErrors();
    
    if (errors){
      console.log(`errors: ${JSON.stringify(errors)}`);
      res.render('login' , {title: ' Login error'});
    }*/

/*2
    global.username = req.body.username;
    global.password = req.body.password;
    const Firstname = 'lala';
    const Lastname = 'lolo';
    const Permission = 'admina';
    console.log(username);
    console.log(password);

    cp.connect().then(function() {
      console.log('Connection pool open for duty');
      var request = new sql.Request(cp);
      */

      //request.query("INSERT INTO [Users] (Usermail, Userpassword) VALUES ('"+global.username+"', '"+global.password+"')").then(function(recordset) {
        //console.log('Recordset: ' + recordset);
        //console.log('Affected: ' + request.rowsAffected);
       // console.log(recordset);
     // });
          /*3 request.query("select * from Users").then(function (recordSet) {
            console.log(recordSet);
          }); 
        }).catch(function(err) {
          console.error('Error creating connection pool', err);
        }); 

      res.sendfile('public/login.html');
    });*/

    
//router.get('/elad', function(req, res, next) {
  //res.sendfile('public/index.html'); ;
  //res.status(200).send('Hi elad');
  //res.render('index', { title: 'Express' });

//}); 

module.exports = router;



/*

    //const db = require('../db.js');
    //const query = require('../query.js');
    //query.loadUsers();
    //var request = new sql.Request(dbConn);
    //request.query("INSERT INTO Users (Usermail, Userpassword) VALUES (?, ?)", [username, password]).then(function(recordset) {
      //console.log('Recordset: ' + recordset);
      //console.log('Affected: ' + request.rowsAffected);
   // })
    //var request = new sql.Request(conn);
   // request.query("select * from Users").then(function (recordSet) {
   //   console.log(recordSet);
  //})
    //loadUsers();
    /*loadUser();
    function loadUser() {
      var dbConn = new sql.ConnectionPool(config);
      dbConn.connect().then(function () {
          var request = new sql.Request(dbConn);
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
  loadUser();*/
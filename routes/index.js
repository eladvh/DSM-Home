var express = require('express');
var router = express.Router();


router.get('/login', function(req, res, next) {
  res.sendfile('public/login.html');

});
  

  router.post('/login', function(req, res, next) {
    global.username = req.body.username;
    global.password = req.body.password;
    const Firstname = 'lala';
    const Lastname = 'lolo';
    const Permission = 'admina';
    console.log(username);
    console.log(password);

    const server = require('../routes/server.js');
    
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

    //request.query("INSERT INTO Users (Usermail, Userpassword) VALUES ('ssssdd', 435735)").then(function(recordset) {
     //   console.log('Recordset: ' + recordset);
     //   console.log('Affected: ' + request.rowsAffected);
    //  })
      //request.query("INSERT INTO Users (Usermail, Userpassword, Firstname, Lastname, Permission) VALUES (?, ?, ?, ?, ?)", [username, password, Firstname, Lastname, Permission]).then(function(recordset) {
        //console.log('Recordset: ' + recordset);
        //console.log('Affected: ' + request.rowsAffected);
      //})
      res.sendfile('public/login.html');
    });

    
//router.get('/elad', function(req, res, next) {
  //res.sendfile('public/index.html'); ;
  //res.status(200).send('Hi elad');
  //res.render('index', { title: 'Express' });

//}); 

module.exports = router;

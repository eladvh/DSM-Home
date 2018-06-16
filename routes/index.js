var express = require('express')
  , routes = require('../routes')
  , user = require('../routes/user')
  
  



exports.index = function(req, res){
  var message = '';
  res.render('login',{message: message});
};

exports.userProfile = function(req, res){
  var userId = req.session.userId;
 if(userId == null){
   res.redirect("/login");
   return;
 }
  else{
    res.render('profile');
  }
};

exports.userProfile1 = function(req, res){
  //res.sendfile('views/basic.ejs');
};



//module.exports = router;
/*router.get('/signin', function(req, res, next) {
  res.sendfile('public/mainpage.html');

}); 
router.post('/signin', function(req, res, next) {
  res.sendfile('index3.html');
});
*/

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
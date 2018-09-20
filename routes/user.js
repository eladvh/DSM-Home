//---------------------------------------------signup page call------------------------------------------------------
exports.signup = function(req, res){
  message = '';
  var sendName = '';
  var sess = req.session; 
  var answer = {sendName, message};
  console.log(req.session);
  var userId = sess.userId;
  if(userId != null){
     res.redirect("/home/dashboard");
     return;
  }

  if(req.method == "POST"){
     var post  = req.body;
     var sname= post.store_name;
     var name= post.user_name;
     var pass= post.password;
     var fname= post.first_name;
     var lname= post.last_name;

     var sql="SELECT id,store_name, first_name, last_name, user_name FROM `tblUser` WHERE `user_name`='"+name+"'"; 
 
       var query = db.query(sql, function(err, results) {
        if(results.length){
            
          req.session.userId = results[0].id;
          req.session.user = results[0];
          console.log(req.session);

          if(name == req.session.user.user_name){
          console.log("duplicate");
          answer.message = "duplicate";
          res.render('new_signup.ejs',{answer:answer});

          }} else {
          var sql = "INSERT INTO `tblUser`(`store_name`,`first_name`,`last_name`,`user_name`, `password`) VALUES ('" + sname + "','" + fname + "','" + lname + "','" + name + "','" + pass + "')";
          db.query(sql, function(err, result) {
          answer.message = "Succesfully! Your account has been created.";
          res.render('new_signup.ejs',{answer:answer});
          })
        }
      });

  } else {
     res.render('new_signup',{answer:answer});
  }
};
 //-----------------------------------------------login page call------------------------------------------------------
 exports.login = function(req, res){
  console.log('welcome to DSM-Home');
  var message = '';
  var sendName = '';
  var sess = req.session; 
  var answer = {sendName, message};
  

  if(req.method == "POST"){
     var post  = req.body;
     var name= post.user_name;
     var pass= post.password;
    
     var sql="SELECT id, first_name, last_name, user_name FROM `tblUser` WHERE `user_name`='"+name+"' and password = '"+pass+"'";                           
     db.query(sql, function(err, results){      
        if(results.length){
           sess.userId = results[0].id;
           answer.sendName = results[0].first_name + ' ' + results[0].last_name;
           sess.user = results[0];
           //console.log(req.session);
           res.render('home_page.ejs',{answer:answer});
        }
        else{
           answer.message = 'Wrong Credentials.';
           res.render('new_login.ejs',{answer:answer});
        }
                
     });
  } else {
     res.render('new_login.ejs',{answer:answer});
  }
};
 //-----------------------------------------------dashboard page functionality----------------------------------------------
        
 exports.dashboard = function(req, res, next){
  var user =  req.session.user;
  var sendName = user.first_name + ' ' + user.last_name;
  var userId = req.session.userId;
	var answer = {sendName};
	if(userId == null){
		res.redirect("/login");
		return;
  }
  res.render('home_page.ejs', {answer:answer});
};
 //------------------------------------logout functionality----------------------------------------------
 exports.logout=function(req,res){
    req.session.destroy(function(err) {
       res.redirect("/login");
    })
 };
 //--------------------------------render user details after login--------------------------------
 const Ebay = require("ebay-node-api");
 
 exports.profile = function(req, res){
  var user = req.session.user;
  var sendName = user.first_name + ' ' + user.last_name;
  var userId = req.session.userId;
  if(userId == null){
     res.redirect("/login");
     return;
  }


  if(req.method == "POST") {
    var post  = req.body;
    var message = '';
    var firstName = post.first_name;
    var lastName = post.last_name;
    var storeName = post.store_name;
    var currency = post.currency;
    var breakEven = post.break_even;
    console.log(post);


    function asyncFunc() {
      return new Promise(
        function (resolve, reject) {
              console.log('Edit User Details'); 
              var sql="SELECT * FROM `tblUser` WHERE `id`='"+userId+"'";
              db.query(sql, function(err, result){ 
                if(firstName == ''){
                   firstName = result[0].first_name;
                 }
               if(lastName == ''){
                   lastName = result[0].last_name;
                 }
               if(storeName == ''){
                   storeName = result[0].store_name;
                 }
              var sql1 = "update tblUser SET store_name = ?, first_name = ?, last_name = ? WHERE id = ?";
              db.query(sql1, [storeName, firstName, lastName, userId], function(err, result) {
              })
              })
              console.log('DB Updated')
              message = "Succesfully! Your profile details has been updated.";
              resolve(message);
    })
  }

    function asyncFunc2() {
      return new Promise(
        function (resolve, reject) {
              console.log('Edit Financial Details'); 
              var sql="SELECT * FROM `tblUser` WHERE `id`='"+userId+"'";
              db.query(sql, function(err, result){ 
              if(currency == ''){
                  currency = result[0].currency;
                }
              if(breakEven == ''){
                  breakEven = result[0].break_even;
                }
              var sql1 = "update tblUser SET currency = ?, break_even = ? WHERE id = ?";
              db.query(sql1, [currency, breakEven, userId], function(err, result) {
              })
              })
              console.log('DB Updated')
              message = "Succesfully! Your financial details has been updated.";
              resolve(message);
    })
  }

  function editUserDetails() {
    asyncFunc()
    .then(result => {
        res.send(message);
    })
    .catch(error => {});
}

    function editFinancial() {
      asyncFunc2()
      .then(result => {
          res.send(message);
      })
      .catch(error => {});
  }

    if(firstName || lastName || storeName)editUserDetails();
    if(currency || breakEven)editFinancial();

  }else{

  var sql="SELECT * FROM `tblUser` WHERE `id`='"+userId+"'";          
  db.query(sql, function(err, result){ 
    if(result.length){ 
      var userName = result[0].user_name;
      var storeName = result[0].store_name
      var firstName = result[0].first_name;
      var lastName= result[0].last_name;
      var currency= result[0].currency;
      var breakEven= result[0].break_even;
    
      let ebay = new Ebay({
        clientID: "EladPint-DSMHome-PRD-0820665a8-01939c18",
        details: true // To require detailed info or put false
    });
    ebay.getUserDetails(storeName).then((data) => {
        //console.log(data);
        var answer = {data,userName,storeName, firstName, lastName, currency, breakEven, sendName};
        res.render('profile.ejs', {answer:answer});
    }, (error) => {
        console.log(error);
    });
    }
  });
}
};
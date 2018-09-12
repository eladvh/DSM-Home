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
     var name= post.user_name;
     var pass= post.password;
     var fname= post.first_name;
     var lname= post.last_name;

     var sql="SELECT id, first_name, last_name, user_name FROM `tblUser` WHERE `user_name`='"+name+"'"; 
 
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
          var sql = "INSERT INTO `tblUser`(`first_name`,`last_name`,`user_name`, `password`) VALUES ('" + fname + "','" + lname + "','" + name + "','" + pass + "')";
          var query = db.query(sql, function(err, result) {
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
 exports.profile = function(req, res){
  var message = '';
  var user = req.session.user;
  var sendName = user.first_name + ' ' + user.last_name;
  var userId = req.session.userId;
  if(userId == null){
     res.redirect("/login");
     return;
  }

  var sql="SELECT * FROM `tblUser` WHERE `id`='"+userId+"'";          
  db.query(sql, function(err, result){ 
    if(result.length){ 
      var userName = result[0].user_name;
      var firstName = result[0].first_name;
      var lastName= result[0].last_name;
    
      var answer = {userName, firstName, lastName, sendName, message};

     res.render('profile.ejs', {answer:answer});
    }
  
  });
};
 //---------------------------------edit users details after login----------------------------------
 exports.editprofile=function(req,res){
  var message = '';
  var user =  req.session.user;
  var sendName = user.first_name + ' ' + user.last_name;
  var userId = req.session.userId;
  if(userId == null){
     res.redirect("/login");
     return;
  }

  var answer = {sendName};

  if(req.method == "POST") {
    var sql="SELECT * FROM `tblUser` WHERE `id`='"+userId+"'";
    db.query(sql, function(err, result){ 

    var post  = req.body;
    var userName = req.session.user.user_name;
    if(post.first_name != ''){
       var firstName = post.first_name; 
      }else{
        var firstName = result[0].first_name;
      }
    if(post.last_name != ''){
      var lastName = post.last_name;
      }else{
        var lastName = result[0].last_name;
      }

      var answer = {userName, firstName, lastName, sendName, message};

    var sql = "update tblUser SET first_name = ? ,last_name = ? WHERE ID = ?";
    var query = db.query(sql, [firstName, lastName, userId], function(err, result) {
    answer.message = "Succesfully! Your profile details has been updated.";
    res.render('profile.ejs', {answer:answer});
    })
  });
}else{
  res.render('profile.ejs');
}
};
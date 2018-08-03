//---------------------------------------------signup page call------------------------------------------------------
exports.signup = function(req, res){
  message = '';
  var userId = req.session.userId;
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

     var sql="SELECT id, first_name, last_name, user_name FROM `users` WHERE `user_name`='"+name+"'"; 
 
       var query = db.query(sql, function(err, results) {
        if(results.length){
            
          req.session.user = results[0];
          console.log(req.session.user);

          if(name == req.session.user.user_name){
          console.log("duplicate");
          message = "duplicate";
          res.render('new_signup.ejs',{message: message});

          }} else {
          var sql = "INSERT INTO `users`(`first_name`,`last_name`,`user_name`, `password`) VALUES ('" + fname + "','" + lname + "','" + name + "','" + pass + "')";
          var query = db.query(sql, function(err, result) {
          message = "Succesfully! Your account has been created.";
          res.render('new_signup.ejs',{message: message});
          })
        }
      });

  } else {
     res.render('new_signup');
  }
};
 //-----------------------------------------------login page call------------------------------------------------------
 exports.login = function(req, res){
    
    var message = 'Wrong Credentials';

    if(req.method == "POST") {
       var post  = req.body;
       var name= post.user_name;
       var pass= post.password;

       var sql="SELECT id, first_name, last_name, user_name FROM `users` WHERE `user_name`='"+name+"' and password = '"+pass+"'"; 

       db.query(sql, function(err, results){      
          if(results.length){

             req.session.userId = results[0].id;
             req.session.user = results[0];
             //console.log(results[0].id);
        
             res.json({"redirect":true,"redirect_url":"http://127.0.0.1:3000/home/dashboard"});
          }else{
             
             console.log('body: ' + JSON.stringify(message));
             res.send(message);
          }     

       });
    } else {
      res.json({"redirect":true,"redirect_url":"http://127.0.0.1:3000/login"});
    } 
      
 };
 //-----------------------------------------------dashboard page functionality----------------------------------------------
        
 exports.dashboard = function(req, res, next){
	//var message = 'check';
	var user =  req.session.user,
	userId = req.session.userId;
	
	if(userId == null){
		res.redirect("/login");
		return;
  }
  res.render('new_home.ejs');
  //res.render('../public/dashboard.html');
  //res.json({"redirect":true,"redirect_url":"http://127.0.0.1:3000/home/dashboard"});

	 //var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";
	 
	   //db.query(sql, function(err, results){
      //if(results.length){
        
      //res.send(JSON.stringify(message));
		   //console.log(results);
		   
       //res.send('ccc');
     
       //res.json({"redirect":true,"redirect_url":"http://127.0.0.1:3000/login"});
      //}
      
       //, {user:user});	  
      
    //});	 
    
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
  var userId = req.session.userId;
  if(userId == null){
     res.redirect("/login");
     return;
  }

  var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";          
  db.query(sql, function(err, result){ 
    if(result.length){ 
      //console.log(result.length);
      var userName = result[0].user_name;
      var firstName = result[0].first_name;
      var lastName= result[0].last_name;
    
     res.render('profile.ejs', {message:message, userName:userName, firstName:firstName, lastName:lastName});
    }
     
     //,{data:result});
  });
};
 //---------------------------------edit users details after login----------------------------------
 exports.editprofile=function(req,res){
  var userId = req.session.userId;
  if(userId == null){
     res.redirect("/login");
     return;
  }

  if(req.method == "POST") {
    var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";
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
    
    
    //if(firstName!= '' || lastName!= ''){

    var sql = "update users SET first_name = ? ,last_name = ? WHERE ID = ?";
    var query = db.query(sql, [firstName, lastName, userId], function(err, result) {
    message = "Succesfully! Your profile details has been updated.";
    res.render('profile.ejs', {message:message, userName:userName, firstName:firstName, lastName:lastName});
    })
  });
  //}
 // else{
 //   res.redirect('profile');
 // }

}else{
  res.render('profile.ejs');
}
};
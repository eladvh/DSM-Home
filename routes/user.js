
//---------------------------------------------signup page call------------------------------------------------------
exports.signup = function(req, res){
    message = '';
    var sess = req.session; 

    if(req.method == "POST"){
       var post  = req.body;
       var name= post.user_name;
       var pass= post.password;
       var fname= post.first_name;
       var lname= post.last_name;
       var mob= post.mob_no;
 
       var sql="SELECT id, first_name, last_name, user_name FROM `users` WHERE `user_name`='"+name+"'"; 
 
       var query = db.query(sql, function(err, results) {
        if(results.length){
            
          req.session.userId = results[0].id;
          req.session.user = results[0];
          console.log(results[0].id);
          if(name == req.session.user.user_name){
          console.log("duplicate");
          }
          
       }
       else{
          var sql = "INSERT INTO `users`(`first_name`,`last_name`,`mob_no`,`user_name`, `password`) VALUES ('" + fname + "','" + lname + "','" + mob + "','" + name + "','" + pass + "')";
        }
        var query = db.query(sql, function(err, result) {
        if(sql){
          message = "Succesfully! Your account has been created.";
          res.render('signup.ejs',{message: message});
        }
          else{
            message = "duplicate.";
            res.render('signup.ejs',{message: message});
          }
       });

       /*else{
        var sql = "INSERT INTO `users`(`first_name`,`last_name`,`mob_no`,`user_name`, `password`) VALUES ('" + fname + "','" + lname + "','" + mob + "','" + name + "','" + pass + "')";
          message = "duplicate.";
          res.render('signup.ejs',{message: message});
       }*/
       });
 
    } else {
       res.render('signup');
    }
 };
  
 //-----------------------------------------------login page call------------------------------------------------------
 exports.login = function(req, res){
    var message = '';
    var sess = req.session; 
 
    if(req.method == "POST"){
       var post  = req.body;
       var name= post.user_name;
       var pass= post.password;
      
       var sql="SELECT id, first_name, last_name, user_name FROM `users` WHERE `user_name`='"+name+"' and password = '"+pass+"'"; 

       db.query(sql, function(err, results){      
          if(results.length){
            
             req.session.userId = results[0].id;
             req.session.user = results[0];
             console.log(results[0].id);
             res.redirect('/home/dashboard');
          }
          else{
             message = 'Wrong Credentials.';
             res.render('login.ejs',{message: message});
             console.log("wrong");
          }
                  
       });
    } else {
       res.render('login.ejs',{message: message});
    }
            
 };
 //-----------------------------------------------dashboard page functionality----------------------------------------------
        
 exports.dashboard = function(req, res, next){
	
	var user =  req.session.user,
	userId = req.session.userId;
	
	if(userId == null){
		res.redirect("/login");
		return;
	}
	 
	 var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";
	 
	   db.query(sql, function(err, results){
		   
		   console.log(results);
		   
		   res.render('dashboard.ejs', {user:user});	  
		  
		});	 
};
 //------------------------------------logout functionality----------------------------------------------
 exports.logout=function(req,res){
    req.session.destroy(function(err) {
       res.redirect("/login");
    })
 };
 //------------------------------------check if user is connected----------------------------------------------
 /*exports.isConnected=function(req,res){
 var userId = req.session.userId;
 if(userId == null){
   res.redirect("/login");
   return;
 }
}; */
 //--------------------------------render user details after login--------------------------------
 /*exports.profile = function(req, res){
 
    var userId = req.session.userId;
    if(userId == null){
       res.redirect("/login");
       return;
    }
 
    var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";          
    db.query(sql, function(err, result){  
       res.render('dashboard.ejs',{data:result});
    });
 };
 //---------------------------------edit users details after login----------------------------------
 exports.editprofile=function(req,res){
    var userId = req.session.userId;
    if(userId == null){
       res.redirect("/login");
       return;
    }
 
    var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";
    db.query(sql, function(err, results){
       res.render('edit_profile.ejs',{data:results});
    });
 }; */
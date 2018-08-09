/*var express = require('express')
  , routes = require('../routes')
  , user = require('../routes/user')*/
  


exports.index = function(req, res){
  console.log('main page');
  var userId = req.session.userId;
  if(userId != null){
     res.redirect("/home/dashboard");
     return;
  }
  var sendName = '';
  var message = '';
  var answer = {sendName, message};
  res.render('new_login',{answer:answer});
};


exports.suppliers = function(req, res){
  var user =  req.session.user;
  var sendName = user.first_name + ' ' + user.last_name;
  var p = 0;
  var message = '';
  var post = {storeNum:'', supplierName:'', establishYear:'', storeLink:'', wechat:'', email:'', skypeID:'', phoneNum:''};
  var answer = {post, message, p, sendName};
  console.log(answer);

  console.log('suppliers page');
  var userId = req.session.userId;
  if(userId == null){
     res.redirect("/login");
     return;
  }
  
  res.render('suppliers1',{answer:answer});
}

exports.addlogs = function(req, res){
  console.log('logs page');
  var user =  req.session.user;
  var sendName = user.first_name + ' ' + user.last_name;
  var p = 0;
  var message = '';
  var answer = {message, p, sendName};

  var userId = req.session.userId;
  if(userId == null){
     res.redirect("/login");
     return;
  }
  //if(req.method == "POST"){

  //}

  res.render('logs_page', {answer:answer});
}


exports.addsup = function(req, res){
  console.log('add suppliers page');
  var user =  req.session.user;
  var sendName = user.first_name + ' ' + user.last_name;
  var p = 0;
  var message = '';
  var answer = {message, p, sendName};
  
  var userId = req.session.userId;
  if(userId == null){
     res.redirect("/login");
     return;
  }
  if(req.method == "POST"){
    var post  = req.body;
    console.log(req.body);
    var storeNum= post.storeNum;
    var supplierName = post.supplierName;
    var establishYear= post.establishYear;
    var storeLink= post.storeLink;
    var wechat= post.wechat;
    var email= post.email;
    var skypeID= post.skypeID;
    var phoneNum= post.phoneNum;

    answer = {post, message, p, sendName};
    console.log(answer);

    var sql="SELECT storeNum, supplierName, establishYear, storeLink, wechat, email,skypeID, phoneNum FROM `tblSuppliers` WHERE `storeNum`='"+storeNum+"'"; 
    var query = db.query(sql, function(err, results) {
      if(results.length){
        q = results[0];
        console.log('check if ' + answer.post.storeNum + ' = ' + q.storeNum + ' ?');

        if(answer.post.storeNum == q.storeNum){
          
          console.log("duplicate");
          answer.message = "duplicate";
          answer.p = 1;
          
          res.render('addsup_page.ejs',{answer:answer});
        }}else{
          var sql = "INSERT INTO `tblSuppliers`(`storeNum`,`supplierName`,`establishYear`, `storeLink`, `wechat`, `email`,`skypeID`, `phoneNum` ) VALUES ('" + storeNum + "','" + supplierName + "','" + establishYear + "','" + storeLink + "' ,'" + wechat + "' ,'" + email + "' ,'" + skypeID + "' ,'" + phoneNum + "')";
          var query = db.query(sql, function(err, result) {
            answer.message = "Succesfully! supplier tab has been created.";
            console.log('success');
            answer.p = 1;
            res.render('suppliers1.ejs',{answer:answer});
          })
        }

    })
  }else{
    res.render('addsup_page', {answer:answer});
  }
}

exports.analitics = function(req, res){
  console.log('analitics page');
  var user =  req.session.user;
  var sendName = user.first_name + ' ' + user.last_name;
  var answer = {sendName};
  
  var userId = req.session.userId;
  if(userId == null){
     res.redirect("/login");
     return;
  }

  res.render('analitics', {answer:answer});
}
/*var express = require('express')
  , routes = require('../routes')
  , user = require('../routes/user')*/
  

 //-----------------------------------------------Main page----------------------------------------------------------------
exports.index = function(req, res){

  var answer = {sendName: '', message:''};

  userId = req.session.userId;
  if(userId != null){
    res.redirect("/home/dashboard");
    return;
 }

  userSession = {
    id: null,
    first_name: null,
    last_name: null,
    user_name: null}
  req.session.user = userSession;
  console.log(req.session);
  
  res.render('new_login',{answer:answer});
};

 //-----------------------------------------------suppliers page----------------------------------------------------------------

exports.suppliers = function(req, res){
  console.log('suppliers page');
  var user =  req.session.user;
  var sendName = user.first_name + ' ' + user.last_name;
  var result = [];
  //var post = {storeNum:'', supplierName:'', establishYear:'', storeLink:'', wechat:'', email:'', skypeID:'', phoneNum:'', dateOfConversion: '',subject: '',methodList: '',content: ''};
  //var post1 = {storeNum: '', supplierName: '', dateOfConversion: '',subject: '',methodList: '',content: ''};
  var post = {storeNum:'', supplierName:'', establishYear:'', storeLink:'', wechat:'', email:'', skypeID:'', phoneNum:''};

  var answer = {post, result, message: '', p: 0, sendName};

  var userId = req.session.userId;
  if(userId == null){
     res.redirect("/login");
     return;
  }

  if(req.method == "POST"){
    //var sql = "SELECT users.name AS user, products.name AS favorite FROM users JOIN products ON users.favorite_product = products.id";
  //var sql="SELECT * FROM tblSuppliers JOIN tblLogs ON tblSuppliers.supplierName = tblLogs.supplierName WHERE `tblSuppliers.supplierName`='"+req.body.supName+"'"; 
  var sql = "SELECT * FROM tblSuppliers WHERE supplierName = '" + req.body.supName + "'"; 
  var query = db.query(sql, function(err, results) {
    console.log(query);
    if(results.length){
      console.log(results[0]);
      answer.post = results[0];
      answer.p = 1;
    }
  })
  /*var sql="SELECT * FROM `tblLogs` WHERE `supplierName`='"+req.body.supName+"'"; 
  var query = db.query(sql, function(err, results) {
    if(results.length){
      console.log('po');
      console.log(result1[0]);
      answer.post1 = results1[0];
      answer.p = 1;
    }
  })*/
  }

  var  getInformationFromDB = function(callback) {
  db.query("SELECT supplierName FROM `tblSuppliers`", function(err, res, fields)
  {
      if (err)  return callback(err);
       if(res.length){
      for(var i = 0; i<res.length; i++ ){     
                      result.push(res[i].supplierName);
          }
       }
     callback(null, result);     
  });
};

  console.log("Call Function");
  getInformationFromDB(function (err, result) {
    if (err) console.log("Database error!");
    else {
      console.log(result);
      res.render('suppliers1',{answer:answer});
    }
  });

}

 //-----------------------------------------------add suppliers page----------------------------------------------------------------

exports.addsup = function(req, res){
  console.log('add suppliers page');
  var user =  req.session.user;
  var sendName = user.first_name + ' ' + user.last_name;
  //var p = 0;
  //var message = '';
  var answer = {message: '', p: 0, sendName};
  
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

    answer = {post, message: '', p: 0, sendName};
    console.log(answer);

    var sql="SELECT storeNum, supplierName, establishYear, storeLink, wechat, email,skypeID, phoneNum FROM `tblSuppliers` WHERE `storeNum`='"+storeNum+"'"; 
    var query = db.query(sql, function(err, results) {
      if(results.length){
        var q = results[0];
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

 //-----------------------------------------------add logs page----------------------------------------------------------------

 exports.addlogs = function(req, res){
  console.log('logs page');
  var user =  req.session.user;
  var sendName = user.first_name + ' ' + user.last_name;
  var answer = {message: '', sendName};

  var userId = req.session.userId;
  if(userId == null){
     res.redirect("/login");
     return;
  }
  if(req.method == "POST"){
    var post  = req.body;
    console.log(req.body);
    var storeNum= post.storeNum;
    var supplierName= post.supplierName;
    var dateOfConversion = post.dateOfConversion;
    var subject= post.subject;
    var methodList= post.methodList;
    var content= post.content;

    answer = {post, message: '', sendName};
    console.log(answer);
    var sql="SELECT * FROM `tblSuppliers` WHERE `storeNum`='"+storeNum+"'"; 
    var query = db.query(sql, function(err, results) {
      if(results.length){
        console.log(results[0]);
        var q = results[0];
        console.log('check if ' + answer.post.storeNum + ' = ' + q.storeNum + ' ?');

        if(answer.post.storeNum == q.storeNum){
          
          var sql = "INSERT INTO `tblLogs`(`storeNum`,`supplierName`,`dateOfConversion`,`title`, `communicationMethod`, `content`) VALUES ('" + storeNum + "','" + supplierName + "','" + dateOfConversion + "','" + subject + "','" + methodList + "' ,'" + content + "')";
          var query = db.query(sql, function(err, results) {
              answer.message = "Succesfully! Log has been created.";
              console.log('success');
              res.render('logs_page', {answer:answer});
          })

        }}else{
          console.log("Supplier Doesn't exist");
          answer.message = "Supplier Doesn't exist";
          //answer.p = 1;
          
          res.render('logs_page',{answer:answer});
  }
    })}else{
    res.render('logs_page', {answer:answer});
  }
}


 //-----------------------------------------------analitics page----------------------------------------------------------------

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
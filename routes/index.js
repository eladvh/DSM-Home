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
  //console.log(req.session);
  
  res.render('new_login',{answer:answer});
};

 //-----------------------------------------------suppliers page----------------------------------------------------------------

exports.suppliers = function(req, res){
  console.log('suppliers page');
  var user =  req.session.user;
  var sendName = user.first_name + ' ' + user.last_name;
  var logsListRes= [];
  var supplierNameMenuRes = [];
  var supplierNameRes= [];
  var storeNumRes = [];
  var post = [];
  var answer = {post, logsListRes, message: '', p: 0, sendName};

  var userId = req.session.userId;
  if(userId == null){
     res.redirect("/login");
     return;
  }

  if(req.method == "POST"){

    var post = req.body;
    var supplierName = post.supplierName;

    function asyncFunc() {
      return new Promise(
          function (resolve, reject) {
            console.log('Get Suppliers Details');
            db.query("SELECT * FROM `tblSuppliers` WHERE `supplierName`='"+supplierName+"'", function(err, results, fields)
            {
                 if(results.length){
                   answer.post = results[0];
           }
                 resolve(answer.post);
            });
          });
    }

    function asyncFunc2() {
      return new Promise(
          function (resolve, reject) {
            console.log('Get Filtered Logs List');
            db.query("SELECT * FROM `tblLogs` WHERE `supplierName`='"+supplierName+"' ORDER BY logNum DESC", function(err, results, fields){
                 if(results.length){
                for(var i = 0; i<results.length; i++ ){     
                         logsListRes.push(results[i]);
                    }
                 }
                 resolve(logsListRes);
            });
          });
    }

    function mainPost() {
    asyncFunc()
    .then(result => {
      return asyncFunc2();
    })
    .then(result2 => {

      answer.logsListRes = logsListRes;
            console.log(answer.logsListRes);
      res.send(answer);
    })
    .catch(error => {});
  }

mainPost();

  /*var sql = "CALL Get_Supplier_Details('"+req.body.supName+"')";
  db.query(sql, function(err, results, fields){
    if(results.length){
      answer.post = results[0][0];
      console.log(answer.post);
      answer.p = 1;
    }
  })*/

  }else{


  function asyncFunc() {
    return new Promise(
        function (resolve, reject) {
          console.log('Get Suppliers Names List');
          db.query("SELECT supplierName FROM `tblSuppliers`", function(err, results, fields)
          {
               if(results.length){
              for(var i = 0; i<results.length; i++ ){     
                        supplierNameRes.push(results[i].supplierName);
                  }
               }
               resolve(supplierNameRes);
          });
        });
  }


  function main() {
    asyncFunc()
    .then(result => {
      answer.supplierNameRes = supplierNameRes;
      res.render('suppliers',{answer:answer});
    })
    .catch(error => {});
  }

  main();
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

  if(req.method == "POST"){
    var message = "check if work";
    res.send(message);
  }

  res.render('analytics', {answer:answer});
}

//-----------------------------------------------add logs page----------------------------------------------------------------

/*exports.addLogs = function(req, res){

  console.log('logs page');
  var user =  req.session.user;
  var sendName = user.first_name + ' ' + user.last_name;
  var logsListRes= [];
  var supplierNameMenuRes = [];
  var supplierNameRes= [];
  var storeNumRes = [];
   //var post = {storeNum: '', supplierName: '', dateOfConversion: '',subject: '',methodList: '',content: ''};
  var answer = {storeNumRes ,supplierNameMenuRes , supplierNameRes, logsListRes, post:'', message: '', sendName};

  var userId = req.session.userId;

  if(userId == null){
     res.redirect("/login");
     return;
  }

  if(req.method == "POST"){
      
    var post = req.body;
    var storeNum = post.storeNum;
    var supplierName1 = post.supplierName1;
    var supplierName2 = post.supplierName2;
    var dateOfConversion = post.dateOfConversion;
    var subject= post.subject;
    var methodList= post.methodList;
    var content= post.content;


    promise1 = new Promise((resolve, reject) => {
      console.log('Get Filtered Logs List');
      db.query("SELECT * FROM `tblLogs` WHERE `supplierName`='"+supplierName2+"' ORDER BY logNum DESC", function(err, results, fields){
           if(results.length){
          for(var i = 0; i<results.length; i++ ){     
                   logsListRes.push(results[i]);
              }
           }
           resolve(logsListRes);
      });
    });

    promise2 = new Promise((resolve, reject) => {
      console.log('Get Store Num List');
      db.query("SELECT storeNum FROM `tblSuppliers` WHERE `supplierName`='"+supplierName1+"'", function(err, results, fields)
      {
           if(results.length){
          for(var i = 0; i<results.length; i++ ){     
                  storeNumRes.push(results[i].storeNum);
              }
           }
           resolve(storeNumRes);
      });
    });


    promise3 = new Promise((resolve, reject) => {
      console.log('Update DB'); 
      if(storeNum){
      var sql = "INSERT INTO `tblLogs`(`storeNum`,`supplierName`,`dateOfConversion`,`title`, `communicationMethod`, `content`) VALUES ('" + storeNum + "','" + supplierName1 + "','" + dateOfConversion + "','" + subject + "','" + methodList + "' ,'" + content + "')";
            db.query(sql, function(err, results) {
              console.log('success');
        });
        resolve(storeNum, supplierName2, dateOfConversion, subject, methodList, content);
      }
      });


    var getHistoryLogsResult = (results) => {
      answer.logsListRes = results[0];
      res.send(logsListRes);

    };

    var getStoreNumResults = (results) => {
      answer.storeNumRes = results[0];
      res.send(storeNumRes);

    };
    
    var addSup = (results) => {
      console.log(results);
      var message = "Succesfully! Log has been created.";
    res.send(message);
    };

    function mainPost() {
      if(supplierName2 && !storeNum){Promise.all([promise1]).then(getHistoryLogsResult);}
      if(supplierName1 && !storeNum){Promise.all([promise2]).then(getStoreNumResults);}
      if(storeNum && supplierName1){Promise.all([promise3]).then(addSup);}
    }
  
  mainPost();
  
  }else{
  
var message = "";

promise1 = new Promise((resolve, reject) => {
    //setTimeout(() => {
      console.log('Get Logs List');
      db.query("SELECT * FROM `tblLogs` ORDER BY logNum DESC", function(err, results, fields)
      {
           if(results.length){
          for(var i = 0; i<results.length; i++ ){     
                          logsListRes.push(results[i]);
              }
           }
             resolve(logsListRes);
      });
        //message += "my";
    //}, 2000)
});

promise2 = new Promise((resolve, reject) => {
    //setTimeout(() => {
      console.log('Get Suppliers Details');
      db.query("SELECT supplierName FROM `tblSuppliers`", function(err, results, fields)
      {
           if(results.length){
          for(var i = 0; i<results.length; i++ ){     
                    supplierNameRes.push(results[i].supplierName);
                    supplierNameMenuRes.push(results[i].supplierName);
              }
           }
           resolve(supplierNameRes);
      });
        //message += " first";
    //}, 2000)
});


var getResult = (results) => {
  //console.log("Results = ", results)
  answer.logsListRes = results[0];
  answer.supplierNameRes = results[1];
  answer.supplierNameMenuRes = results[1];
  
  res.render('logs_page',{answer:answer});
};

function main() {
    Promise.all([promise1, promise2]).then(getResult);
    //console.log("\"\"" + message);
}

main();
}
}*/
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


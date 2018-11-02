//-----------------------------------------------suppliers page----------------------------------------------------------------
exports.suppliers = function(req, res){
    console.log('suppliers page');
    var user =  req.session.user;
    var sendName = user.first_name + ' ' + user.last_name;
    var logsListRes= [];
    var supplierNameRes= [];
    var itemListRes = [];
    var ordersListRes = [];
    var post = [];
    var supOrdersQty = [];
    var supOrdersDates = [];
    var supOrdersNum = [];
    var answer = {itemListRes, post ,logsListRes, message: '',sendName, supOrdersQty, supOrdersDates, supOrdersNum};
  
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
  
      function asyncFunc3() {
        return new Promise(
          function (resolve, reject) { 
            console.log('Get Item Details');
            db.query("Call Get_items_Details_By_SupplierName('"+ supplierName +"')", function(err, results, fields)
            {
                 if(results.length){
                for(var i = 0; i<results[0].length; i++ ){     
                          itemListRes.push(results[0][i]);
                    }
                 }
                 resolve(itemListRes);
            });
      })
    }
  
    function asyncFunc4() {
      return new Promise(
          function (resolve, reject) {
            console.log('Get Filtered Logs List');
            db.query("SELECT * FROM `tblOrders` WHERE `supplierName`='"+supplierName+"' ORDER BY orderNum DESC", function(err, results, fields){
                 if(results.length){
                for(var i = 0; i<results.length; i++ ){     
                         ordersListRes.push(results[i]);
                    }
                 }
                 resolve(ordersListRes);
            });
          });
    }

    function asyncFunc5() {
        return new Promise(
          function (resolve, reject) {
            console.log('Get Quantity Of Orders'); 
            db.query('CALL Last_month_orders_culc("'+supplierName+'")', function(err, results, fields){
                if(results[0].length){
                    for(i = 0; i < results[0].length; i++){
                    supOrdersQty.push(results[0][i].qtySold)
                    supOrdersDates.push(results[0][i].orderDate)
                    }
                    answer.supOrdersNum = results[0].length;
                }
                resolve();
            })
      })
    }
  
      function mainPost() {
      asyncFunc()
      .then(result => {
        return asyncFunc2();
      })
      .then(result2 => {
        answer.logsListRes = logsListRes;
        return asyncFunc3();
      }).then(result3 => {
        answer.itemListRes = itemListRes;
        console.log(itemListRes)
        return asyncFunc4();
      }).then(result4 => {
        answer.ordersListRes = ordersListRes;
        return asyncFunc5();
      }).then(result5 => {
        console.log(answer)
        res.send(answer);
      })
      .catch(error => {});
    }
  
  mainPost();
  
    }else{
  
  
    function asyncFunc() {
      return new Promise(
          function (resolve, reject) {
            console.log('Get Suppliers Names List');
            db.query("SELECT DISTINCT supplierName FROM `tblSuppliers`", function(err, results, fields)
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
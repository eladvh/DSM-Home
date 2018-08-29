var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
 
 //-----------------------------------------------items page----------------------------------------------------------------
 exports.addItem = function(req, res){

    console.log('Items page');
    var user =  req.session.user;
    var sendName = user.first_name + ' ' + user.last_name;
    var message = '';
    var itemListRes = [];
    var itemsNameRes = [];
    var supplierNameRes = [];
    var storeNumRes = [];
    var answer = {sendName, message, supplierNameRes, storeNumRes, itemsNameRes};
  
    var userId = req.session.userId;
  
    if(userId == null){
       res.redirect("/login");
       return;
    }

  
    if(req.method == "POST"){
      var post  = req.body;
      console.log(post);
      var itemName = post.itemName;
      var storeItemLink = post.storeItemLink;
      var itemPic = post.itemPic;
      var category = post.category;
      var itemPrice = post.itemPrice;
      var supplierName = post.supplierName;



      function asyncFunc() {
        return new Promise(
            function (resolve, reject) {
              console.log('Get Store Num List');
              db.query("SELECT storeNum FROM `tblSuppliers` WHERE `supplierName`='"+supplierName+"'", function(err, results, fields)
              {
                   if(results.length){
                  for(var i = 0; i<results.length; i++ ){     
                          storeNumRes.push(results[i].storeNum);
                      }
                   }
                   resolve(storeNumRes);
              })
      })
    }

    function asyncFunc2() {
      return new Promise(
        function (resolve, reject) {
          console.log('Get Item Details');
          db.query("SELECT itemName FROM `tblItems` ORDER BY itemCode DESC", function(err, results, fields)
          {
               if(results.length){
              for(var i = 0; i<results.length; i++ ){     
                        itemsNameRes.push(results[i].itemName);
                  }
               }
               resolve(itemsNameRes);
          });
    })
  }

    function asyncFunc3() {
      return new Promise(
        function (resolve, reject) {
              console.log('Update DB'); 
              var sql = "INSERT INTO `tblItems`(`itemName`,`storeItemLink`, `itemPic`,`category`, `itemPrice`) VALUES ('" + itemName + "','" + storeItemLink + "','" + itemPic + "' ,'" + category + "','" + itemPrice + "')";
              var query = db.query(sql, function(err, result) {
                if(result.length){
                console.log('success');
                }     
                answer.message = "Succesfully! New item has been listed.";
                resolve(message); 
              })
    })
  }

      async function callSupFunc() {
        await asyncFunc()
        .then(result => {
          return asyncFunc2();
        })
        .then(result2 => {
          res.send(answer);
        })
        .catch(error => {});
      }

      function callInsertFunc() {
        asyncFunc3()
        .then(result => {
          res.send(answer);
        })
        .catch(error => {});
      }
    
if(supplierName)callSupFunc();
if(itemName && !supplierName  )callInsertFunc();

      /*function asyncFunc() {
          return new Promise(
            function (resolve, reject) {
              if(itemName){
                  console.log('Update DB'); 
                  var sql = "INSERT INTO `tblItems`(`itemName`,`storeItemLink`, `itemPic`,`category`, `itemPrice`) VALUES ('" + itemName + "','" + storeItemLink + "','" + itemPic + "' ,'" + category + "','" + itemPrice + "')";
                  var query = db.query(sql, function(err, result) {
                    if(result.length){
                    console.log('success');
                    }     
                    answer.message = "Succesfully! New item has been listed.";
                    resolve(answer.message); 
                  })
                }else{
                console.log('skip Update DB');
                resolve();
                }
        })

      }

      function asyncFunc2() {
        return new Promise(
            function (resolve, reject) {
              if(supplierName){
              console.log('Get Store Num List');
              db.query("SELECT storeNum FROM `tblSuppliers` WHERE `supplierName`='"+supplierName+"'", function(err, results, fields)
              {
                   if(results.length){
                  for(var i = 0; i<results.length; i++ ){     
                          storeNumRes.push(results[i].storeNum);
                      }
                   }
                   resolve(storeNumRes);
              })
            }else{
            console.log('skip Get Store Num List');
            resolve();
            }
      })
    }

    async function asyncFunc3() {
      return new Promise(
          function (resolve, reject) {
            if(supplierName){
            console.log('Get Store Num List');
            db.query("SELECT storeNum FROM `tblSuppliers` WHERE `supplierName`='"+supplierName+"'", function(err, results, fields)
            {
                 if(results.length){
                for(var i = 0; i<results.length; i++ ){     
                        storeNumRes.push(results[i].storeNum);
                    }
                 }
                 resolve(storeNumRes);
            })
          }else{
          console.log('skip Get Store Num List');
          resolve();
          }
    })
  }

      function mainPost() {
        asyncFunc()
        .then(result => {
          return asyncFunc2();
        })
        .then(result2 => {
          answer.storeNumRes = storeNumRes;
        })
        .then(result3 => {
          answer.storeNumRes = storeNumRes;
          res.send(answer);
        })
        .catch(error => {});
      }
    
    mainPost();*/

    }else{
  
      function asyncFunc() {
        return new Promise(
            function (resolve, reject) {
              console.log('Get Item Details');
              db.query("SELECT * FROM `tblItems` ORDER BY itemCode DESC", function(err, results, fields)
              {
                   if(results.length){
                  for(var i = 0; i<results.length; i++ ){     
                            itemListRes.push(results[i]);
                      }
                   }
                   resolve(itemListRes);
              });
            });
      }
    

      function asyncFunc2() {
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
          answer.itemListRes = itemListRes;
          return asyncFunc2();
        })
        .then(result2 => {
          answer.supplierNameRes = supplierNameRes;
          res.render('item_page',{answer:answer});
        })
        .catch(error => {});
      }
      main();
    }
  }

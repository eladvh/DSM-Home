 //-----------------------------------------------items page----------------------------------------------------------------
 exports.addItem = function(req, res){

    console.log('Items page');
    var user =  req.session.user;
    var sendName = user.first_name + ' ' + user.last_name;
    var message = '';
    var nitemListRes = [];
    var itemListRes = [];
    var itemsNameRes = [];
    var supplierNameRes = [];
    var storeNumRes = [];
    var answer = {sendName, message, supplierNameRes, storeNumRes, nitemListRes, itemsNameRes, itemListRes};
  
    var userId = req.session.userId;
  
    if(userId == null){
       res.redirect("/login");
       return;
    }

  
    if(req.method == "POST"){
      var post  = req.body;
      //console.log(post);
      var itemName = post.itemName;
      var storeItemLink = post.storeItemLink;
      var itemPic = post.itemPic;
      var category = post.category;
      var itemPrice = post.itemPrice;
      var supplierName = post.supplierName;
      var storeNum = post.storeNum;
      var supItemLink = post.supItemLink;
      var supItemPrice = post.supItemPrice;

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
        console.log('Update supplierItem table'); 
        db.query("SELECT itemCode FROM `tblItems` WHERE `itemName`='"+itemName+"'", function(err, results, fields){
          //console.log(results);
          if(results.length){
            db.query("SELECT itemCode FROM `tblsupplieritem` WHERE `itemCode`='"+results[0].itemCode+"'", function(err, results1, fields){
            if(results1.length){
              var sql = "update tblsupplieritem SET altSupplierName = ? ,altSupItemLink = ?, altSupItemPrice = ? WHERE itemCode = ?";
              db.query(sql, [supplierName, supItemLink, supItemPrice, results[0].itemCode], function(err, result) {
              })
            }else{
        var sql = "INSERT INTO `tblsupplieritem`(`supplierName`,`storeNum`, `itemCode`,`supItemPrice`, `supItemLink`) VALUES ('" + supplierName + "','" + storeNum + "','" + results[0].itemCode + "','" + supItemPrice + "','" + supItemLink + "')";
        db.query(sql, function(err, result) {
          //console.log(result);
          console.log('Successed to insert supplier item');
        })
      }})
      }
      })
      answer.message = "Succesfully! item has been associated to supplier.";
      resolve(message); 
  })
}

    function asyncFunc4() {
      return new Promise(
        function (resolve, reject) {
              console.log('Update DB'); 
              var sql1 = "INSERT INTO `tblItems`(`itemName`,`storeItemLink`, `itemPic`,`category`, `itemPrice`) VALUES ('" + itemName + "','" + storeItemLink + "','" + itemPic + "' ,'" + category + "','" + itemPrice + "')";
              var query = db.query(sql1, function(err, result) {
                if(result.length){
                console.log('success');
                console.log(result);
                }     
                answer.message = "Succesfully! New item has been listed.";
                resolve(message); 
              })
    })
  }

       function callSupFunc() {
         asyncFunc()
        .then(result => {
          return asyncFunc2();
        })
        .then(result2 => {
          res.send(answer);
        })
        .catch(error => {});
      }

      function callInsertFunc() {
        asyncFunc4()
        .then(result => {
          res.send(answer);
        })
        .catch(error => {});
      }
      
      function callInsertSupFunc(){
        asyncFunc3()
        .then(result => {
          res.send(answer);
        })
        .catch(error => {});
      }
    
if(supplierName && ! itemName)callSupFunc();
if(itemName && !supplierName)callInsertFunc();
if(itemName && supplierName)callInsertSupFunc();

    }else{
  
      function asyncFunc() {
        return new Promise(
            function (resolve, reject) {
              console.log('Get associated Item Details');
              db.query("CALL Get_Associated_Items_Details", function(err, results, fields)
              {
                   if(results.length){
                    for(var i = 0; i<results[0].length; i++){   
                            itemListRes.push(results[0][i]);
                    }
                    console.log(itemListRes)
                   }
                   resolve(itemListRes);
              });
            });
      }

      function asyncFunc2() {
        return new Promise(
            function (resolve, reject) {
              console.log('Get Item Details');
              db.query("CALL Get_Non_Associated_Items_Details", function(err, results, fields)
              {
                   if(results.length){
                    for(var i = 0; i<results[0].length; i++){   
                            nitemListRes.push(results[0][i]);
                    }
                   }
                   resolve(nitemListRes);
              });
            });
      }
    

      function asyncFunc3() {
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
          console.log(itemListRes);
          return asyncFunc2();
        })
        .then(result2 => {
          answer.nitemListRes = nitemListRes;
          return asyncFunc3();
        })
        .then(result3 => {
          answer.supplierNameRes = supplierNameRes;
          res.render('item_page',{answer:answer});
        })
        .catch(error => {});
      }
      main();
    }
  }


//-----------------------------------------------API items page----------------------------------------------------------------
var url = require('url');
exports.addItemAuto = function(req, res){
console.log('Items page');
var user =  req.session.user;
var sendName = user.first_name + ' ' + user.last_name;
var answer = {sendName};
var userId = req.session.userId;
  
if(userId == null){
res.redirect("/login");
return;
}

if(req.method == "POST"){
var post  = req.body;
//console.log(post);
var eBayItemNumber = post.eBayItemNumber;
var aliexpressItemNumber = post.aliexpressItemNumber;

  if(eBayItemNumber){
  var adr = eBayItemNumber;
  var q = url.parse(adr, true);
  if(q.host == 'www.ebay.com'){
  eBayItemNumber = q.pathname.split('/')[2];
  }else{
  eBayItemNumber = adr;
  }
  console.log(eBayItemNumber);
  }

  if(aliexpressItemNumber){
  var adr2 = aliexpressItemNumber;
  var q2 = url.parse(adr2, true);
  if(q2.host == 'www.aliexpress.com'){
    if(q2.pathname.split('/')[1] == 'item'){
      aliexpressItemNumber = q2.pathname.split(/[/.]/)[3];
    }else if(q2.pathname.split('/')[1] == 'store'){
      aliexpressItemNumber = q2.pathname.split(/[/._]/)[5];
    }
  }else{
    aliexpressItemNumber = adr2;
  }
  console.log(aliexpressItemNumber)
  }

}

  res.render('auto_item_page',{answer:answer});
}
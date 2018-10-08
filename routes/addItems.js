 //-----------------------------------------------items page----------------------------------------------------------------
 var url = require('url');
const Ebay = require("ebay-node-api");
var AliexScrape = require('aliexscrape');
 exports.addItem = function(req, res){

    console.log('Items page');
    var user =  req.session.user;
    var sendName = user.first_name + ' ' + user.last_name;
    var message = '';
    var nitemListRes = [];
    var itemListRes = [];
    var itemsNameRes = [];
    var itemsNameResAuto = [];
    var supplierNameRes = [];
    var storeNumRes = [];
    var answer = {sendName, message, supplierNameRes, storeNumRes, nitemListRes, itemsNameRes, itemsNameResAuto, itemListRes};
  
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
      var eBayItemNumberAuto = post.eBayItemNumberAuto;
      var aliexpressItemNumberAuto = post.aliexpressItemNumberAuto;

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
        var aliexpressItemNumber = supItemLink;
        if(aliexpressItemNumber){
          var adr2 = aliexpressItemNumber;
          var q2 = url.parse(adr2, true);
          if(q2.host == 'www.aliexpress.com'){
            if(q2.pathname.split('/')[1] == 'item'){
              aliexpressItemNumber = q2.pathname.split(/[/.]/)[3];
            }else if(q2.pathname.split('/')[1] == 'store'){
              aliexpressItemNumber = q2.pathname.split(/[/._]/)[5];
            }
          }else if(!isNaN(aliexpressItemNumber)){
            aliexpressItemNumber = adr2;
          }else{
            console.log('error!')
          }
          console.log(aliexpressItemNumber)
          }
          db.query("SELECT supItemCode FROM `tblsupplieritem` WHERE `supItemCode`='"+aliexpressItemNumber+"'", function(err, result, fields){
            if(!result.length){
          var sql = "INSERT INTO `tblsupplieritem`(`supItemCode`,`supplierName`,`storeNum`,`itemName`, `supItemLink`,`supItemPrice`) VALUES ('" + aliexpressItemNumber + "','" + supplierName + "','" + storeNum + "','" + itemName + "','" + supItemLink + "','" + supItemPrice + "')";
          db.query(sql, function(err, result1) {
            if(result1.length){
            console.log('success');
            }
        })
        db.query("SELECT itemCode FROM `tblItems` WHERE `itemName`='"+itemName+"'", function(err, result2, fields){
        if(result2.length){
          console.log('here')
          db.query("SELECT IFNULL(supItemCode,sup2ItemCode) AS supItemCode FROM `tblitemref` where itemCode = '"+result2[0].itemCode+"'", function(err, result3, fields){
            if(!result3[0].supItemCode){
              var sql1 = "update tblitemref SET supItemCode = ? WHERE itemCode = ?";
              db.query(sql1, [aliexpressItemNumber, result2[0].itemCode], function(err, result) {
              })
            }else if(result3[0].supItemCode){
              db.query("SELECT IFNULL(sup2ItemCode,sup3ItemCode) AS sup2ItemCode FROM `tblitemref` where itemCode = '"+result2[0].itemCode+"'", function(err, result4, fields){
                if(!result4[0].sup2ItemCode){
                  var sql2 = "update tblitemref SET sup2ItemCode = ? WHERE itemCode = ?";
                  db.query(sql2, [aliexpressItemNumber, result2[0].itemCode], function(err, result) {
                  })
                }else{
                  var sql3 = "update tblitemref SET sup3ItemCode = ? WHERE itemCode = ?";
                  db.query(sql3, [aliexpressItemNumber, result2[0].itemCode], function(err, result) {
                  })
                }
              })
            }
          })

          }
      })
      answer.message = "Succesfully! item has been associated to supplier.";
      resolve(message); 
    }else{
      answer.message = "Duplicate! this item already associated.";
      resolve(message); 
    }
  })

  })
}

    function asyncFunc4() {
      return new Promise(
        function (resolve, reject) {
              console.log('Update DB'); 
              var eBayItemNumber = storeItemLink
              if(eBayItemNumber){
                var adr = eBayItemNumber;
                var q = url.parse(adr, true);
                if(q.host == 'www.ebay.com'){
                  if(!isNaN(q.pathname.split('/')[2])){
                    eBayItemNumber = q.pathname.split('/')[2];
                  }else if(!isNaN(q.pathname.split('/')[3])){
                    eBayItemNumber = q.pathname.split('/')[3];
                    }
                }else if(!isNaN(eBayItemNumber)){
                eBayItemNumber = adr;
                }else{
                  console.log('error!')
                }
                console.log(eBayItemNumber);
                }
                db.query("SELECT itemCode FROM `tblitems` WHERE `ItemCode`='"+eBayItemNumber+"'", function(err, result, fields){
                  if(!result.length){
              var sql = "INSERT INTO `tblItems`(`itemCode`,`itemName`,`storeItemLink`, `itemPic`,`category`, `itemPrice`) VALUES ('" + eBayItemNumber + "','" + itemName + "','" + storeItemLink + "','" + itemPic + "' ,'" + category + "','" + itemPrice + "')";
              db.query(sql, function(err, result) {
                if(result.length){
                console.log('success');
                }     
              })
              var sql1 = "INSERT INTO `tblitemref`(`itemCode`) VALUES ('" + eBayItemNumber + "')";
              db.query(sql1, function(err, result2) {
                if(result2.length){
                console.log('success');
                }     
              })
              answer.message = "Succesfully! New item has been listed.";
              resolve(message); 
            }else{
              answer.message = "Duplicate! item already exist in your store.";
              resolve(message); 
            }
          })
    })
  }

    function asyncFunc5() {
      return new Promise(
         function (resolve, reject) { 
          console.log('Insert Auto Item');
          if(eBayItemNumberAuto){
            var adr = eBayItemNumberAuto;
            var q = url.parse(adr, true);
            if(q.host == 'www.ebay.com'){
              if(!isNaN(q.pathname.split('/')[2])){
                eBayItemNumberAuto = q.pathname.split('/')[2];
              }else if(!isNaN(q.pathname.split('/')[3])){
                eBayItemNumberAuto = q.pathname.split('/')[3];
                }
            }else if(!isNaN(eBayItemNumberAuto)){
              eBayItemNumberAuto = adr;
            }else{
              console.log('error!')
            }
            console.log(eBayItemNumberAuto);
            }

            let ebay = new Ebay({
              clientID: process.env.APPID,
              clientSecret: process.env.CERTID,
              body: {
                  grant_type: "client_credentials",
                  scope: "https://api.ebay.com/oauth/api_scope"
              }
            });
          
             ebay.getAccessToken().then((data) => {
               ebay.getItemByItemGroup(eBayItemNumberAuto).then((data) => {
                  var obj = JSON.parse(data);
                  //console.log(obj)
                  var title = obj.items[0].title;
                  var itemWebUrl = obj.items[0].itemWebUrl;
                  var imageUrl = obj.items[0].image.imageUrl;
                  var categoryPath = obj.items[0].categoryPath.split('|').slice(-1)[0];
                  var value = obj.items[0].price.value;
                  var sql = "INSERT INTO `tblItems`(`itemCode`,`itemName`,`storeItemLink`, `itemPic`,`category`, `itemPrice`) VALUES ('" + eBayItemNumberAuto + "','" + title + "','" + itemWebUrl + "','" + imageUrl + "' ,'" +categoryPath + "','" + value + "')";
                  db.query(sql, function(err, result) {
                    if(result.length){
                    console.log('success');
                    }     
                  })
                  var sql1 = "INSERT INTO `tblitemref`(`itemCode`) VALUES ('" + eBayItemNumberAuto + "')";
                  db.query(sql1, function(err, result2) {
                    if(result2.length){
                    console.log('success');
                    }     
                  })
              })
          }, (error) => {
              console.log(error);
          });
          
          answer.message = "Succesfully! New item has been listed.";
          resolve(message); 
    })
  }

  function asyncFunc6() {
    return new Promise(
      function (resolve, reject) { 
        console.log('Associate Auto Item');
        if(aliexpressItemNumberAuto){
          var adr2 = aliexpressItemNumberAuto;
          var q2 = url.parse(adr2, true);
          if(q2.host == 'www.aliexpress.com'){
            if(q2.pathname.split('/')[1] == 'item'){
              aliexpressItemNumberAuto = q2.pathname.split(/[/.]/)[3];
            }else if(q2.pathname.split('/')[1] == 'store'){
              aliexpressItemNumberAuto = q2.pathname.split(/[/._]/)[5];
            }
          }else if(!isNaN(aliexpressItemNumberAuto)){
            aliexpressItemNumberAuto = adr2;
          }else{
            console.log('error!')
          }
          console.log(aliexpressItemNumberAuto)
          }
        
          AliexScrape(aliexpressItemNumberAuto)
          .then(response => {
            var obj = JSON.parse(response);
            //console.log(obj)
            console.log(obj.store.name)
            console.log(obj.store.id)
            console.log(adr2)
            console.log(obj.variations[0].pricing)
            var sql = "INSERT INTO `tblsupplieritem`(`supItemCode`,`supplierName`,`storeNum`,`itemName`, `supItemLink`,`supItemPrice`) VALUES ('" + aliexpressItemNumberAuto + "','" + obj.store.name + "','" + obj.store.id + "','" + adr2 + "','" + adr2 + "','" + obj.variations[0].pricing + "')";
            db.query(sql, function(err, result) {
              if(result.length){
              console.log('success');
              }     
            })
          })
          .catch(error => console.log(error));

          answer.message = "Succesfully! item has been associated to supplier.";
          resolve(message); 
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

      function callAutoInsertFunc(){
        asyncFunc5()
        .then(result => {
          res.send(answer);
        })
        .catch(error => {});
      }

      function callAutoInsertSupFunc(){
        asyncFunc6()
        .then(result => {
          res.send(answer);
        })
        .catch(error => {});
      }
    
if(supplierName && ! itemName)callSupFunc();
if(itemName && !supplierName)callInsertFunc();
if(itemName && supplierName)callInsertSupFunc();
if(eBayItemNumberAuto)callAutoInsertFunc();
if(aliexpressItemNumberAuto)callAutoInsertSupFunc();

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
            console.log('Get Items Names');
            db.query("SELECT itemName FROM `tblItems` ORDER BY itemCode DESC", function(err, results, fields)
            {
                 if(results.length){
                for(var i = 0; i<results.length; i++ ){     
                          itemsNameResAuto.push(results[i].itemName);
                    }
                 }
                 resolve(itemsNameResAuto);
            });
      })
    }

    function asyncFunc4() {
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
          answer.nitemListRes = nitemListRes;
          return asyncFunc3();
        })
        .then(result3 => {
          answer.itemsNameResAuto = itemsNameResAuto;
          return asyncFunc4();
        })
        .then(result4 => {
          answer.supplierNameRes = supplierNameRes;
          res.render('item_page',{answer:answer});
        })
        .catch(error => {});
      }
      main();
    }
  }


//-----------------------------------------------API items page----------------------------------------------------------------
var ebay1 = require('ebay-api');
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
    if(!isNaN(q.pathname.split('/')[2])){
      eBayItemNumber = q.pathname.split('/')[2];
    }else if(!isNaN(q.pathname.split('/')[3])){
      eBayItemNumber = q.pathname.split('/')[3];
      }
  }else if(!isNaN(eBayItemNumber)){
  eBayItemNumber = adr;
  }else{
    console.log('error!')
  }
  console.log(eBayItemNumber);
  }

ebay1.xmlRequest({
  serviceName : 'Trading',
  opType : 'GetOrders',

  devId: process.env.DEVID,
  certId: process.env.CERTID,
  appId: process.env.APPID,
  sandbox: false,

  authToken: process.env.EBAY_AUTHTOKEN,

  params: {
    'OrderStatus': 'Completed',
    'NumberOfDays': 2
  }
}, function(error, results) {
  //console.log(results[0])
  var obj = JSON.parse(JSON.stringify(results))
  //console.log(obj.Orders[0].Transactions[0])
  console.log(obj.Orders[0].Transactions[0].Item.Title)
  console.log(obj.Orders[0].Transactions[0].CreatedDate)
  console.log(obj.Orders[0].Transactions[0].QuantityPurchased)
  console.log(obj.Orders[0].Transactions[0].ShippingDetails.ShipmentTrackingDetails[0].ShipmentTrackingNumber)
});

  /*let ebay = new Ebay({
    clientID: process.env.APPID,
    clientSecret: process.env.CERTID,
    body: {
        grant_type: "client_credentials",
        scope: "https://api.ebay.com/oauth/api_scope"
    }
  });*/

  // Get access token and pass it to this method
/*ebay.getAccessToken()
.then((data) => {
    ebay.getItem(`v1|${eBayItemNumber}|0`).then((data) => {
        //console.log(data);
        console.log(data.title);
        console.log(data.itemWebUrl);
        console.log(data.image.imageUrl)
        console.log(data.categoryPath.split('|').slice(-1)[0])
        console.log(data.price.value)
    })
}, (error) => {
  console.log(error);
});*/


  /*ebay.getAccessToken().then((data) => {
    var e = eBayItemNumber;
    //for(var i=0; i<2; i++){
    ebay.getItemByItemGroup(e).then((data) => {
        var obj = JSON.parse(data);
        console.log(obj)
        console.log(obj.items[0].title)
        console.log(obj.items[0].itemWebUrl)
        console.log(obj.items[0].image.imageUrl)
        console.log(obj.items[0].categoryPath.split('|').slice(-1)[0])
        console.log(obj.items[0].price.value)
    })
  //}
}, (error) => {
    console.log(error);
});/*

 /* if(aliexpressItemNumber){
  var adr2 = aliexpressItemNumber;
  var q2 = url.parse(adr2, true);
  if(q2.host == 'www.aliexpress.com'){
    if(q2.pathname.split('/')[1] == 'item'){
      aliexpressItemNumber = q2.pathname.split(/[/.]/)[3];
    }else if(q2.pathname.split('/')[1] == 'store'){
      aliexpressItemNumber = q2.pathname.split(/[/._]/)[5];
    }
  }else if(!isNaN(aliexpressItemNumber)){
    aliexpressItemNumber = adr2;
  }else{
    console.log('error!')
  }
  console.log(aliexpressItemNumber)
  }

  AliexScrape(aliexpressItemNumber)
  .then(response => {
    var obj = JSON.parse(response);
    //console.log(obj)
    console.log(obj.store.name)
    console.log(obj.store.id)
    console.log(adr2)
    console.log(obj.variations[0].pricing)
  })
  .catch(error => console.log(error));
*/
}

  res.render('auto_item_page',{answer:answer});
}
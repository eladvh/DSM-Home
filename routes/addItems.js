 //-----------------------------------------------items page----------------------------------------------------------------
const url = require('url');
const xlsx = require('node-xlsx');
const fs = require('fs');
const request = require('request');
const cheerio = require("cheerio");
const path = require('path');
const Ebay = require("ebay-node-api");
const eBay = require('ebay-node-client')(process.env.APPID, process.env.CERTID);
const ebay = require('ebay-api');
const AliexScrape = require('aliexscrape');

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
      var excel = req.file;

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
          console.log('Get Item Details1');
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
          db.query("SELECT itemCode FROM `tblitems` WHERE `ItemCode`='"+eBayItemNumberAuto+"'", async function(err, results, fields){
            if(!results.length){
              await ebay.xmlRequest({
                'serviceName': 'Shopping',
                'opType': 'GetSingleItem',
                'appId': process.env.APPID,
                
                params: {
                  'ItemID': eBayItemNumberAuto
                }
              },
              function(error, data) {
                if(!error){
                var title = data.Item.Title;
                var itemWebUrl = `https://www.ebay.com/itm/${eBayItemNumberAuto}`;
                if(data.Item.PictureURL.constructor === Array){
                  var imageUrl = data.Item.PictureURL[0];
                  }else{
                    var imageUrl = data.Item.PictureURL
                  }
                var categoryPath = data.Item.PrimaryCategoryName.split(':').slice(-1)[0];
                var value = data.Item.ConvertedCurrentPrice.amount;
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
              }
              });
          answer.message = "Succesfully! New item has been listed.";
          resolve(message); 
          }else{
            answer.message = "Duplicate! item already exist in your store.";
            resolve(message); 
          }
          })
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

          db.query("SELECT supItemCode FROM `tblsupplieritem` WHERE `supItemCode`='"+aliexpressItemNumberAuto+"'",async function(err, result, fields){
            if(!result.length){
              await AliexScrape(aliexpressItemNumberAuto)
              .then(response => {
                var obj = JSON.parse(response);
                var storeName = obj.store.name.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
                var storeID = obj.store.id
                var storeLink = adr2;
                var price = obj.variations[0].pricing;
                console.log(`store name is: ${storeName} and store ID is: ${storeID}`)
                db.query("CALL check_if_sup_is_null('"+ storeName +"','"+ storeID +"')", function(err, results, fields){
                  console.log('result is: ' + results);
                  if(!results[0].length){
                    var supStoreLink = `https://www.aliexpress.com/store/${storeID}`;
                    console.log(supStoreLink)
                    var sqlSupInsert = "INSERT INTO `tblsuppliers`(`supplierName`,`storeNum`,`storeLink`) VALUES ('" + storeName + "','" + storeID + "','" + supStoreLink + "')";
                    db.query(sqlSupInsert, function(err, result) {
                      if(result.length){
                      console.log('success');  
                      }
                    })
                  }
                  var sql = "INSERT INTO `tblsupplieritem`(`supItemCode`,`supplierName`,`storeNum`,`itemName`, `supItemLink`,`supItemPrice`) VALUES ('" + aliexpressItemNumberAuto + "','" + storeName + "','" + storeID + "','" + itemName + "','" + storeLink + "','" + price + "')";
                  db.query(sql, function(err, result) {
                    if(result.length){
                    console.log('success');
                    }     
                  })
                })
              }).catch(error => console.log(error));
              db.query("SELECT itemCode FROM `tblItems` WHERE `itemName`='"+itemName+"'", function(err, result2, fields){
              if(result2.length){
                db.query("SELECT IFNULL(supItemCode,sup2ItemCode) AS supItemCode FROM `tblitemref` where itemCode = '"+result2[0].itemCode+"'", function(err, result3, fields){
                  if(!result3[0].supItemCode){
                    var sql1 = "update tblitemref SET supItemCode = ? WHERE itemCode = ?";
                    db.query(sql1, [aliexpressItemNumberAuto, result2[0].itemCode], function(err, result) {
                    })
                  }else if(result3[0].supItemCode){
                    db.query("SELECT IFNULL(sup2ItemCode,sup3ItemCode) AS sup2ItemCode FROM `tblitemref` where itemCode = '"+result2[0].itemCode+"'", function(err, result4, fields){
                      if(!result4[0].sup2ItemCode){
                        var sql2 = "update tblitemref SET sup2ItemCode = ? WHERE itemCode = ?";
                        db.query(sql2, [aliexpressItemNumberAuto, result2[0].itemCode], function(err, result) {
                        })
                      }else{
                        var sql3 = "update tblitemref SET sup3ItemCode = ? WHERE itemCode = ?";
                        db.query(sql3, [aliexpressItemNumberAuto, result2[0].itemCode], function(err, result) {
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

  function asyncFunc7() {
    return new Promise(
        async function (resolve, reject) {
          console.log('Load Excel Details')
          async function asyncFunction(){
            var ebayNumsArr = [];
            var aliexpressNumsArr = [];
            var aliexpressLinksArr = [];
            var obj = xlsx.parse(path.join(__dirname + `../../public/uploads/${excel.filename}`));
            var obj = xlsx.parse(fs.readFileSync(path.join(__dirname + `../../public/uploads/${excel.filename}`)));
            for(var i = 0; i < obj[0].data.length; i++ ){
            eBayItemNumberAuto = obj[0].data[i][0];
            await ebayNumsArr.push(ebayArr(eBayItemNumberAuto));
            aliexpressItemNumberAuto = obj[0].data[i][1];
            aliexpressLinksArr.push(aliexpressItemNumberAuto);
            await aliexpressNumsArr.push(aliexpessArr(aliexpressItemNumberAuto))
          }
          for(var j = 0; j < obj[0].data.length; j++ ){
            await itemsModules(ebayNumsArr[j],aliexpressNumsArr[j],aliexpressLinksArr[j])
          }
          setTimeout(function() {
            finishFunc()
          }, 1000 * obj[0].data.length * 2);
          }
          await asyncFunction()
            function ebayArr(eBayItemNumberAuto){
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
            return eBayItemNumberAuto;
          }
        }
        
        function aliexpessArr(aliexpressItemNumberAuto){
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
              return aliexpressItemNumberAuto;
              }
        }
            function itemsModules(eBayItemNumberAuto, aliexpressItemNumberAuto, aliexpressItemLink){
              if(eBayItemNumberAuto){
             db.query("SELECT itemCode FROM `tblitems` WHERE `ItemCode`='"+eBayItemNumberAuto+"'", async function(err, results, fields){
              if(!results.length){
                  await ebay.xmlRequest({
                  'serviceName': 'Shopping',
                  'opType': 'GetSingleItem',
                  'appId': process.env.APPID,
                  
                  params: {
                    'ItemID': eBayItemNumberAuto
                  }
                },
                 await function(error, data) {
                  if(!error){
                  var title = data.Item.Title.replace(/['"]/g,'');
                  var itemWebUrl = `https://www.ebay.com/itm/${eBayItemNumberAuto}`;
                  if(data.Item.PictureURL.constructor === Array){
                    var imageUrl = data.Item.PictureURL[0];
                    }else{
                      var imageUrl = data.Item.PictureURL;
                    }
                  var categoryPath = data.Item.PrimaryCategoryName.split(':').slice(-1)[0];
                  var value = data.Item.ConvertedCurrentPrice.amount;
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
                  
                  db.query("SELECT supItemCode FROM `tblsupplieritem` WHERE `supItemCode`='"+aliexpressItemNumberAuto+"'",async function(err, result, fields){
                    if(!result.length){
                      await AliexScrape(aliexpressItemNumberAuto)
                      .then(response => {
                        var obj = JSON.parse(response);
                        var storeName = obj.store.name.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
                        var storeID = obj.store.id
                        var storeLink = aliexpressItemLink;
                        var price = obj.variations[0].pricing;
                        db.query("CALL check_if_sup_is_null('"+ storeName +"','"+ storeID +"')", function(err, results, fields){
                          if(!results[0].length){
                            var supStoreLink = `https://www.aliexpress.com/store/${storeID}`;
                            console.log(supStoreLink)
                            var sqlSupInsert = "INSERT INTO `tblsuppliers`(`supplierName`,`storeNum`,`storeLink`) VALUES ('" + storeName + "','" + storeID + "','" + supStoreLink + "')";
                            db.query(sqlSupInsert, function(err, result) {
                              if(result.length){
                              console.log('success');  
                              }
                            })
                          }
                          var sql = "INSERT INTO `tblsupplieritem`(`supItemCode`,`supplierName`,`storeNum`,`itemName`, `supItemLink`,`supItemPrice`) VALUES ('" + aliexpressItemNumberAuto + "','" + storeName + "','" + storeID + "','" + title + "','" + storeLink + "','" + price + "')";
                          db.query(sql, function(err, result) {
                            if(result.length){
                            console.log('success');
                            }     
                          })
                        })
                      }).catch(error => console.log('Item Link Broken - Association Failed'));
                      db.query("SELECT itemCode FROM `tblItems` WHERE `itemName`='"+title+"'", function(err, result2, fields){
                      if(result2.length){
                        db.query("SELECT IFNULL(supItemCode,sup2ItemCode) AS supItemCode FROM `tblitemref` where itemCode = '"+result2[0].itemCode+"'", function(err, result3, fields){
                          if(!result3[0].supItemCode){
                            var sql1 = "update tblitemref SET supItemCode = ? WHERE itemCode = ?";
                            db.query(sql1, [aliexpressItemNumberAuto, result2[0].itemCode], function(err, result) {
                            })
                          }else if(result3[0].supItemCode){
                            db.query("SELECT IFNULL(sup2ItemCode,sup3ItemCode) AS sup2ItemCode FROM `tblitemref` where itemCode = '"+result2[0].itemCode+"'", function(err, result4, fields){
                              if(!result4[0].sup2ItemCode){
                                var sql2 = "update tblitemref SET sup2ItemCode = ? WHERE itemCode = ?";
                                db.query(sql2, [aliexpressItemNumberAuto, result2[0].itemCode], function(err, result) {
                                })
                              }else{
                                var sql3 = "update tblitemref SET sup3ItemCode = ? WHERE itemCode = ?";
                                db.query(sql3, [aliexpressItemNumberAuto, result2[0].itemCode], function(err, result) {
                                })
                              }
                            })
                          }
                        })
                        }
                    })
                    console.log('Item association success');
                  }else{
                    console.log('Item association failed');
                  }
                  })
                }
                })
            console.log(`${eBayItemNumberAuto} - Item Insert Success`);
            }else{
            console.log(`${eBayItemNumberAuto} - Item Insert Failed`);
            }
            })
          }
          }
            //}
            function finishFunc(){
            console.log('complete!')
            answer.message = 'Import data from Excel was successful!'
            resolve(message)
            }
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

      function callInsertExcelRows(){
        asyncFunc7()
        .then(result => {
          res.JSON(answer);
        })
        .catch(error => {});
      }
    
if(supplierName && ! itemName)callSupFunc();
if(itemName && itemPic && !supplierName)callInsertFunc();
if(itemName && supplierName)callInsertSupFunc();
if(eBayItemNumberAuto)callAutoInsertFunc();
if(aliexpressItemNumberAuto && itemName)callAutoInsertSupFunc();
if(excel)callInsertExcelRows();

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
              console.log('Get Item Details2');
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
exports.addItemAuto = async function(req, res){
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
console.log(post);
var eBayItemNumber = post.eBayItemNumber;
var aliexpressItemNumber = post.aliexpressItemNumber;
/*var excel = req.file;
var obj = xlsx.parse(path.join(__dirname + `../../public/uploads/${excel.filename}`)); // parses a file 
var obj = xlsx.parse(fs.readFileSync(path.join(__dirname + `../../public/uploads/${excel.filename}`))); // parses a buffer 
for(var i = 0; i < obj[0].data.length; i++ ){
  console.log(obj[0].data[i])
  eBayItemNumber = obj[0].data[i][0]*/
  /*    if(eBayItemNumber){
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

await ebay.xmlRequest({
  'serviceName': 'Shopping',
  'opType': 'GetSingleItem',
  'appId': process.env.APPID,      // FILL IN YOUR OWN APP KEY, GET ONE HERE: https://publisher.ebaypartnernetwork.com/PublisherToolsAPI
  
  params: {
    'ItemID': eBayItemNumber      // FILL IN A REAL ItemID
  }
},
function(error, data) {
  if(!error){
  //console.log(data)
  console.log(data.Item.Title);
  console.log(`https://www.ebay.com/itm/${eBayItemNumber}`);
  console.log(data.Item.PictureURL[0]);
  console.log(data.Item.PrimaryCategoryName.split(':').slice(-1)[0]);
  console.log(data.Item.ConvertedCurrentPrice.amount);
}
})*/
  //aliexpressItemNumberAuto = obj[0].data[i][1];
  var aliexpressItemNumberAuto = 'https://www.aliexpress.com/store/product/Luxury-Xiaomi-Mi6-Case-Full-Protection-3-in-1-Aluminum-Metal-PC-Hard-Hybrid-Slim-Back/2204153_32843641293.html?spm=2114.12010612.0.0.44a55803vTpjMi&af=KOxy2x&cn=aliexpress&cv=banner&dp=19TZ1ObCPgZix2Y&tp2=KOxy2x&afref=rtbs24.com&mall_affr=pr3&af=KOxy2x&cn=aliexpress&cv=banner&dp=19TZ1ObCPgZix2Y&tp2=KOxy2x&afref=rtbs24.com&aff_platform=link-c-tool&cpt=1539529668253&sk=cD4TW1tW&aff_trace_key=d312dda1f43948269e2d372f52f55564-1539529668253-05526-cD4TW1tW&terminal_id=bf32c3f763514d81935f2a4d953ff76a';
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

    await AliexScrape(aliexpressItemNumberAuto)
    .then(response => {
      var obj = JSON.parse(response);
      //console.log(obj)
      console.log(obj.store.name)
      console.log(obj.store.id)
      console.log(adr2)
      console.log(obj.variations[0].pricing)
      console.log(`https://www.aliexpress.com/store/${obj.store.id}`)
    })
    .catch(error => console.log('error'));
  //}

 /* if(eBayItemNumber){
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

try {
  var token = await eBay.application.getOAuthToken({
      grant_type: 'client_credentials',
      scope: 'https://api.ebay.com/oauth/api_scope'
  });
  eBay.setToken(token.access_token);
} catch (error) {
  console.log('error ', error);
  return;
}

let ebay = new Ebay({
  clientID: process.env.APPID,
  clientSecret: process.env.CERTID,
  body: {
      grant_type: "client_credentials",
      scope: "https://api.ebay.com/oauth/api_scope"
  }
})

itemId = `v1|${eBayItemNumber}|0`;
try {
  var response = await eBay.browse.getItem(itemId);
  //console.log('response', response);
          //console.log(data);
          console.log(response.title);
          console.log(response.itemWebUrl);
          console.log(response.image.imageUrl)
          console.log(response.categoryPath.split('|').slice(-1)[0])
          console.log(response.price.value)
} catch (error) {
  //console.log('error', error);
  ebay.getAccessToken().then((data) => {
    var e = eBayItemNumber;
    //for(var i=0; i<2; i++){
    ebay.getItemByItemGroup(e).then((data) => {
        var obj = JSON.parse(data);
        //console.log(obj)
        console.log(obj.items[0].title)
        console.log(obj.items[0].itemWebUrl)
        console.log(obj.items[0].image.imageUrl)
        console.log(obj.items[0].categoryPath.split('|').slice(-1)[0])
        console.log(obj.items[0].price.value)
    })
  //}
}, (error) => {
    console.log(error);
});
}*/

/*ebay1.xmlRequest({
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





}

/*var userToken = process.env.EBAY_AUTHTOKEN2;
eBay.setUserToken(userToken);
var epId = '273421268275';
try {
    var response = await eBay.catalog.getProduct(epId);
    console.log('response', response);
} catch (error) {
    console.log('error ', error);
    return;
}*/
/*ebay.xmlRequest({
  'serviceName': 'Shopping',
  'opType': 'GetSingleItem',
  'appId': process.env.APPID,      // FILL IN YOUR OWN APP KEY, GET ONE HERE: https://publisher.ebaypartnernetwork.com/PublisherToolsAPI
  
  params: {
    'ItemID': '272916219900'      // FILL IN A REAL ItemID
  }
},
function(error, data) {
  if(!error){
  //console.log(data)
  console.log(data.Item.Title);
  //console.log(`https://www.ebay.com/itm/${eBayItemNumberAuto}`);
  console.log(data.Item.PictureURL[0]);
  console.log(data.Item.PrimaryCategoryName.split(':').slice(-1)[0]);
  console.log(data.Item.ConvertedCurrentPrice.amount);
}
});*/

/*await AliexScrape('32717160078')
.then(response => {
  var obj = JSON.parse(response);
  console.log(obj.store.name)
  console.log(obj.store.id)
  console.log(adr2)
  console.log(obj.variations[0].pricing)
  console.log(`https://www.aliexpress.com/store/${obj.store.id}`)
})
.catch(error => console.log(error));
*/

//}
  res.render('auto_item_page',{answer:answer});
}
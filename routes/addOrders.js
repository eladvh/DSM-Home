const Ebay = require("ebay-node-api");
var AliExpressSpider = require('aliexpress');
var AliexScrape = require('aliexscrape');
const ebay = require('ebay-api');
const geartrack = require('geartrack');
//-----------------------------------------------add orders page----------------------------------------------------------------

exports.addOrder = function(req, res){
var user =  req.session.user;
var sendName = user.first_name + ' ' + user.last_name;
var itemsNameRes = [];
var ordersListRes = [];
var supplierNameRes = [];
var trakeInfo = [];
var message = '';
var id = [];
var arr= [];
var last_element = '';
var answer = {sendName, message, last_element, itemsNameRes, supplierNameRes, ordersListRes, trakeInfo}

var userId = req.session.userId;
  


if(userId == null){
   res.redirect("/login");
   return;
}
if(req.method == "POST"){

    var post  = req.body;
    console.log(post);
    var supplierName = post.supplierName
    var itemName = post.itemName;
    var itemPrice = post.itemPrice;
    var orderDate = post.orderDate;
    var qtySold = post.qtySold;
    var trackNum = post.trackNum;
    var orderNum = post.orderNum;
    var refundDate = post.refundDate;
    var reason = post.reason;
    var loadOrders = post.loadOrders;
    var associateSup = post.associateSup;

    function asyncFunc() {
        return new Promise(
          function (resolve, reject) { 
            console.log('Get Item Details');
                if(supplierName.constructor === Array){
                last_element = supplierName[supplierName.length - 1];
                console.log(last_element);
                }else{
                  last_element = supplierName;
                  console.log(last_element); 
                }
            db.query("Call Get_itemName_By_SupplierName('"+ last_element +"')", function(err, results, fields)
            {
                 if(results.length){
                for(var i = 0; i<results[0].length; i++ ){
                    console.log(results[0][i])     
                          itemsNameRes.push(results[0][i].itemName);
                    }
                 }
                 resolve(itemsNameRes);
            });
      })
    }

    function asyncFunc2() {
        return new Promise(
          function (resolve, reject) {
                console.log('Update DB'); 
                db.query("CALL get_itemPrice_and_supItemPrice_by_supplier('"+ supplierName +"')", function(err, results, fields){
                if(results.length){
                    if(supplierName == results[0][0].supplierName){
                        var supItemPrice = results[0][0].supItemPrice;
                        var supItemLink = results[0][0].supItemLink;
                    }else if(supplierName == results[0][0].supplierName2){
                        var supItemPrice = results[0][0].supItemPrice2;
                        var supItemLink = results[0][0].supItemLink2;
                    }else if(supplierName == results[0][0].supplierName3){
                        var supItemPrice = results[0][0].supItemPrice3;
                        var supItemLink = results[0][0].supItemLink3;
                    }
                    orderNum = Math.floor(Math.random() * 100000000001);
                    //for(var i = 0 ; i< itemName.length; i++){
                    var sql = "INSERT INTO `tblorders`(`orderNum`,`supplierName`,`itemName`,`supItemPrice`,`itemPrice`,`orderDate`,`qtySold`,`statusOfOrder`, supItemLink) VALUES ('"+orderNum+"','" + supplierName + "','" + itemName + "','" + supItemPrice + "','" + results[0][0].itemPrice + "','" + orderDate + "','" + qtySold + "' ,'Pending','"+supItemLink+"')";
                    var query = db.query(sql, function(err, result) {
                    if(result.length){
                    console.log('success');
                    console.log(result);
                    }
                    })
                    //}
                }    
                  answer.message = "Succesfully! New order has been added.";
                  resolve(message); 
                })
      })
    }

    function asyncFunc3() {
        return new Promise(
          function (resolve, reject) {
                console.log('Edit Tracking Number'); 
                var sql = "update tblOrders SET statusOfOrder = ? , trackNum = ? WHERE orderNum = ?";
                db.query(sql, ['ACCEPTED',trackNum, orderNum ], function(err, result) {
                })
                console.log('DB Updated')
                resolve();
      })
    }

    function asyncFunc4() {
        return new Promise(
          function (resolve, reject) {
                console.log('Delete Record'); 
                var sql = "DELETE FROM tblOrders WHERE orderNum = ?";
                db.query(sql,[orderNum] , function (err, result) {
                });
                console.log('DB Updated')
                resolve();
      })
    }

    function asyncFunc5() {
        return new Promise(
          function (resolve, reject) {
                console.log('Insert refund'); 
                var sql1 = "update tblOrders SET statusOfOrder = ?, orderDate = ? WHERE orderNum = ?";
                db.query(sql1, ['Refund',refundDate, orderNum], function(err, result) {
                })
                var sql = "INSERT INTO `tblRefunds`(`refundNum`,`supplierName`,`itemName`,`refundAmount`,`qtyRefunded`,`refundDate`,`reason`) VALUES ('" + orderNum + "','" + supplierName + "','" + itemName + "','" + itemPrice*qtySold + "','" + qtySold + "' ,'" + refundDate +"','" + reason + "')";
                var query = db.query(sql, function(err, result) {
                  if(result.length){
                  console.log('success');
                  console.log(result);
                  }
                })
                resolve();
      })
    }

    function asyncFunc6() {
        return new Promise(
          function (resolve, reject) {
            console.log('Get orders Details');
            function loadOrders() {
                return new Promise(resolve => {
                    ebay.xmlRequest({
                        serviceName : 'Trading',
                        opType : 'GetOrders',
                      
                        devId: process.env.DEVID,
                        certId: process.env.CERTID,
                        appId: process.env.APPID,
                        sandbox: false,
                      
                        authToken: process.env.EBAY_AUTHTOKEN,
                      
                        params: {

                          'NumberOfDays': 30
                        }
                      }, function(error, results) {
                        var obj = JSON.parse(JSON.stringify(results))
                        
                        var orderArr = []
                        var order = {};
                        for(i = 0; i < obj.Orders.length; i++){
                          try{
                            console.log(obj.Orders[i].OrderStatus)
                            var OrderStatus = obj.Orders[i].OrderStatus;
                            var eBayItemNumberAuto = obj.Orders[i].Transactions[0].Item.ItemID;
                            var orderNum = obj.Orders[i].Transactions[0].OrderLineItemID;
                            var itemName = obj.Orders[i].Transactions[0].Item.Title;
                            var itemPrice = obj.Orders[i].Transactions[0].TransactionPrice.amount;
                            var orderDate = obj.Orders[i].Transactions[0].CreatedDate
                            var qtySold = obj.Orders[i].Transactions[0].QuantityPurchased;
                            var trackNum = obj.Orders[i].Transactions[0].ShippingDetails.ShipmentTrackingDetails[0].ShipmentTrackingNumber;
                          }catch (error){
                            trackNum = '';
                          }finally{
                            orderArr.push(order = {orderNum , itemName, itemPrice, orderDate, qtySold, trackNum, eBayItemNumberAuto, OrderStatus})
                          }
                        }
                        setTimeout(() => {
                            resolve(orderArr);
                        }, 10000);
                    })
                });
              }

              function getSupNames(order, supNamesArr){
                return new Promise(resolve => {
                    console.log(order.eBayItemNumberAuto)
                    db.query("Call get_supNames_by_itemName('"+order.eBayItemNumberAuto+"')", function(err, results, fields){
                        if(results[0].length){
                            if(results[0][0].supplierName){
                                var sup1 = results[0][0].supplierName;
                            }else{
                                var sup1 = '';
                            }
                            if(results[0][0].supplierName2){
                                var sup2 = results[0][0].supplierName2;
                            }else{
                                var sup2 = '';
                            }
                            if(results[0][0].supplierName3){
                                var sup3 = results[0][0].supplierName3;
                            }else{
                                var sup3 = '';
                            }
                            supNamesArr.push([sup1, sup2, sup3])
                        }else{
                            var sup1 = '';
                            var sup2 = '';
                            var sup3 = '';
                            supNamesArr.push([sup1, sup2, sup3])
                        }
                        resolve(supNamesArr);
                    })
                });
              }

              function ordersFunc(order, supNamesArr) {
                return new Promise(resolve => {
                    console.log(order.orderNum)
                    var sup1 = supNamesArr[0]
                    var sup2 = supNamesArr[1]
                    var sup3 = supNamesArr[2]
                    db.query("SELECT * FROM `tblorders` WHERE orderNum = '"+order.orderNum+"'", function(err, results, fields){
                        if(!results.length){
                            db.query("SELECT itemCode FROM `tblitems` WHERE `ItemCode`='"+order.eBayItemNumberAuto+"'", function(err, results1, fields){
                                if(!results1.length){
                                    ebay.xmlRequest({
                                    'serviceName': 'Shopping',
                                    'opType': 'GetSingleItem',
                                    'appId': process.env.APPID,
                                    
                                    params: {
                                      'ItemID': order.eBayItemNumberAuto
                                    }
                                  },
                                    function(error, data) {
                                    if(!error){
                                    var title = data.Item.Title.replace(/['"]/g,'');
                                    var itemWebUrl = `https://www.ebay.com/itm/${order.eBayItemNumberAuto}`;
                                    if(data.Item.PictureURL.constructor === Array){
                                      var imageUrl = data.Item.PictureURL[0];
                                      }else{
                                        var imageUrl = data.Item.PictureURL;
                                      }
                                    var categoryPath = data.Item.PrimaryCategoryName.split(':').slice(-1)[0];
                                    var value = data.Item.ConvertedCurrentPrice.amount;
                                    db.query("INSERT INTO `tblItems`(`itemCode`,`itemName`,`storeItemLink`, `itemPic`,`category`, `itemPrice`) VALUES ('" + order.eBayItemNumberAuto + "','" + title + "','" + itemWebUrl + "','" + imageUrl + "' ,'" +categoryPath + "','" + value + "')", function(err, results, fields){
                                        if(err){
                                            console.log('bug1')
                                        }
                                    })
                                    db.query("INSERT INTO `tblitemref`(`itemCode`) VALUES ('" + order.eBayItemNumberAuto + "')", function(err, results, fields){
                                    if(err){
                                        console.log('bug2')
                                    }
                                    })
                                }
                            })
                        }
                        if(order.OrderStatus == 'Active'){
                        db.query("INSERT INTO `tblorders`(`orderNum`,`supplierName`,`itemName`,`itemPrice`,`orderDate`, `qtySold`,`statusOfOrder`,`trackNum`) VALUES ('" + order.orderNum + "','"+`${sup1}|${sup2}|${sup3}`+"','" + order.itemName + "','" + order.itemPrice + "','" + order.orderDate + "','" + order.qtySold + "','Refund','" + order.trackNum + "')", function(err, results, fields){   
                        if(err){
                            console.log('bug3')
                        }
                        })
                        db.query("INSERT INTO `tblrefunds`(`refundNum`,`supplierName`,`itemName`,`refundAmount`,`qtyRefunded`, `refundDate`) VALUES ('" + order.orderNum + "','"+`${sup1}|${sup2}|${sup3}`+"','" + order.itemName + "','" + order.itemPrice*order.qtySold + "','" + order.qtySold + "','" + order.orderDate + "')", function(err, results, fields){   
                            if(err){
                                console.log('bug4')
                            }
                        })
                        }else{
                        db.query("INSERT INTO `tblorders`(`orderNum`,`supplierName`,`itemName`,`itemPrice`,`orderDate`, `qtySold`,`trackNum`) VALUES ('" + order.orderNum + "','"+`${sup1}|${sup2}|${sup3}`+"','" + order.itemName + "','" + order.itemPrice + "','" + order.orderDate + "','" + order.qtySold + "','" + order.trackNum + "')", function(err, results, fields){   
                            if(err){
                                console.log('bug5')
                            }
                        })
                        }
                    })
                        }else{
                            if(order.OrderStatus == 'Active'){
                                console.log('Already refunded')
                            }else if(results[0].supItemPrice){
                                var sql = "update tblorders SET itemName = ?, itemPrice = ?, orderDate = ?, qtySold = ?, trackNum = ? WHERE orderNum = ?";
                                db.query(sql, [order.itemName, order.itemPrice, order.orderDate, order.qtySold, order.trackNum, order.orderNum])
                            }else{
                                var sql1 = "update tblorders SET supplierName = ?, itemName = ?, itemPrice = ?, orderDate = ?, qtySold = ?, trackNum = ? WHERE orderNum = ?";
                                db.query(sql1, [`${sup1}|${sup2}|${sup3}` ,order.itemName, order.itemPrice, order.orderDate, order.qtySold, order.trackNum, order.orderNum])
                            }
                        }
                        resolve();
                    })
                });
              }
              
              async function addAsync() {
                let orderArr = await loadOrders();
                let supNamesArr = [];
                for(let i = 0; i < orderArr.length; i++){
                supNamesArr = await getSupNames(orderArr[i], supNamesArr);
                }
                for(let j = 0; j < orderArr.length; j++){
                await ordersFunc(orderArr[j], supNamesArr[j], j);
                }
              }
              
              
              addAsync().then(() => {
                console.log('done');
                db.query("SELECT * FROM `tblorders`", function(err, results, fields)
                {
                     if(results.length){
                      for(var i = 0; i<results.length; i++){  
                              ordersListRes.push(results[i])
                          }
                     }
                     resolve(ordersListRes);
                });
              });
      })
    }

    function asyncFunc7() {
        return new Promise(
            function (resolve, reject) {
                console.log('Get Tracking Details');
                db.query("SELECT trackNum FROM `tblorders`", function(err, results, fields)
                {
                     if(results.length){
                        for(var i = 0; i<results.length; i++){
                            id.push(results[i].trackNum);
                        }

                        function delay() {
                            return new Promise(resolve => setTimeout(resolve, 300));
                           }
                          async function delayedLog(tracking) {
                              if(tracking){
                            geartrack.cainiao.getInfo(tracking, (err, TrakerInfo) => {
                                if(err) { return }
                                trakeInfo.push(TrakerInfo);
                                if(TrakerInfo.states.length != 0){
                                    for(var i = TrakerInfo.states.length-1; i > 0 ; i-- ){
                                        arr[i] = TrakerInfo.states[i].state.split(/[&\/\\#,+()$~%.'":*?<>{}' ']/g)
                                        for(var j = 0; j < arr[i].length ; j++){
                                            //console.log(arr[i][j])
                                            if(arr[i][j] == 'delivered' || arr[i][j] == 'Delivered' || arr[i][j] == 'delivery' || arr[i][j] == 'Delivery' || arr[i][j] == '交付' || arr[i][j] == '交貨'){
                                                var sql = "update tblOrders SET statusOfOrder = ? WHERE trackNum = ?";
                                                db.query(sql, ['DELIVERED', tracking], function(err, result) {
                                                })
                                            }
                                            if(arr[i][j] == 'transit' || arr[i][j] == 'Transit' || arr[i][j] == 'Despatch' || arr[i][j] == 'Accepted' || arr[i][j] == 'Acceptance'){
                                                var sql = "update tblOrders SET statusOfOrder = ? WHERE trackNum = ?";
                                                db.query(sql, ['IN TRANSIT', tracking], function(err, result) {
                                                })
                                            }
                                        }
                                    }
                                    //console.log('-------------------------------------------------------------------------');
                                }
                                });
                            }
                            
                            await delay(); 
                            //console.log(tracking);
                          }
                          async function processArray(array) {
                            for (const tracking in array) {
                              await delayedLog(array[tracking])
                            }
                            //console.log(trakeInfo);
                          }
    
                          processArray(id);
                     }
                })
                resolve(trakeInfo);
    
                //resolve();
              });
      }

      function asyncFunc8() {
        return new Promise(
          function (resolve, reject) {
                console.log('Associate supplier to order'); 
                db.query("SELECT supItemLink, supItemPrice FROM `tblsupplieritem` WHERE `supplierName` = '"+associateSup+"' AND `itemName` = '"+itemName+"'", function(err, results, fields){
                    if(results.length){
                        var sql = "update tblorders SET supplierName = ?,supItemLink = ?, supItemPrice = ? WHERE orderNum = ?";
                        db.query(sql, [associateSup,results[0].supItemLink ,results[0].supItemPrice,orderNum])
                    }
                })
                message = `Succesfully! the order associated to ${associateSup}`;
                resolve(message);
      })
    }


    function loadItems() {
        asyncFunc()
        .then(result => {
            console.log('sup: ' + last_element);
            console.log('the array: ' + answer.itemsNameRes);
            res.send(answer);
        })
        .catch(error => {});
    }

    function updateDB() {
        asyncFunc2()
        .then(result => {
            res.send(answer);
        })
        .catch(error => {});
    }

    
    function editTrack() {
        asyncFunc3()
        .then(result => {
            res.send(answer);
        })
        .catch(error => {});
    }

    function deleteRecord() {
        asyncFunc4()
        .then(result => {
            res.send(answer);
        })
        .catch(error => {});
    }

    function insertRefund() {
        asyncFunc5()
        .then(result => {
            res.send(answer);
        })
        .catch(error => {});
    }
    
    function loadOrdersFunc() {
        asyncFunc6()
        .then(result => {
            return asyncFunc7();
        }).then(result2 => {
            answer.message = 'Successfuly! check out your orders'
            res.send(answer);
        })
        .catch(error => {});
    }

    function associateSupFunc() {
        asyncFunc8()
        .then(result => {
            res.JSON(answer);
        })
        .catch(error => {});
    }

    if(supplierName && !itemName)loadItems();
    if(supplierName && itemName && qtySold && !orderNum)updateDB();
    if(trackNum && orderNum)editTrack();
    if(orderNum && !trackNum && !supplierName && !associateSup && !itemName)deleteRecord();
    if(orderNum && supplierName && itemName && itemPrice)insertRefund();
    if(loadOrders)loadOrdersFunc();
    if(associateSup && associateSup !='' && itemName && orderNum)associateSupFunc();
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

function asyncFunc2() {
    return new Promise(
        function (resolve, reject) {
          console.log('done');
          db.query("SELECT * FROM `tblorders` ORDER BY orderDate DESC", function(err, results, fields)
              {
                   if(results.length){
                    for(var i = 0; i<results.length; i++){  
                            ordersListRes.push(results[i])
                        }
                   }
                   resolve(ordersListRes);
              });


        });
  }


async function main() {
    await asyncFunc();
    await asyncFunc2();
  }
  main().then(() => {
    res.render('orders_page',{answer:answer}); 
  });




  }
}


          /*function getEbayNums(ebayNumsArr) {
            return new Promise(resolve => {
                db.query("SELECT orderNum FROM `tblorders` ORDER BY orderDate DESC", function(err, results, fields){
                     if(results.length){
                      for(var i = 0; i<results.length; i++){  
                          //console.log(results[i].orderNum.slice(0, 12));
                          ebayNumsArr.push(results[i].orderNum.slice(0, 12));
                      }
                      }
                      resolve(ebayNumsArr);
                    })
            });
          }

          function getSupsNames(eBayItemNumberAuto, supsNamesArr) {
            return new Promise(resolve => {
                db.query("Call get_supNames_by_itemName('"+eBayItemNumberAuto+"')", function(err, results, fields){
                    if(results[0].length){
                        if(results[0][0].supplierName){
                            var sup1 = results[0][0].supplierName;
                        }else{
                            var sup1 = '';
                        }
                        if(results[0][0].supplierName2){
                            var sup2 = results[0][0].supplierName2;
                        }else{
                            var sup2 = '';
                        }
                        if(results[0][0].supplierName3){
                            var sup3 = results[0][0].supplierName3;
                        }else{
                            var sup3 = '';
                        }
                        supsNamesArr.push([sup1, sup2, sup3])
                    }else{
                        var sup1 = '';
                        var sup2 = '';
                        var sup3 = '';
                        supsNamesArr.push([sup1, sup2, sup3])
                    }
                    resolve();
                })
            });
          }

          function updateSupField(supsNamesArr, j) {
            return new Promise(resolve => {
                var sup1 = supsNamesArr[0]
                var sup2 = supsNamesArr[1]
                var sup3 = supsNamesArr[2]
                db.query("SELECT orderNum, supItemPrice FROM `tblorders`", function(err, results, fields){
                    if(results.length){
                        console.log(j)
                        console.log(results[j])
                        if(!results[j].supItemPrice){
                            console.log('1')
                            var sql = "update tblorders SET supplierName = ? WHERE orderNum = ?";
                            db.query(sql, [`${sup1}|${sup2}|${sup3}`, results[j].orderNum])
                        }else{
                            console.log('2')
                        }
                    }
                    resolve()
                })
            });
          }
          
          async function addAsync() {
            let ebayNumsArr = [];
            let ebayNums = await getEbayNums(ebayNumsArr);
            console.log(ebayNums)
            let supsNamesArr = [];
            for(var i = 0; i < ebayNums.length; i++){
            await getSupsNames(ebayNums[i],supsNamesArr);
            }
            console.log(supsNamesArr);
            console.log(supsNamesArr.length)
            for(var j = 0; j < supsNamesArr.length; j++){
            await updateSupField(supsNamesArr[j], j);
            }
          }
          
          
          addAsync().then(() => {
            console.log('done');
            db.query("SELECT * FROM `tblorders` ORDER BY orderDate DESC", function(err, results, fields)
                {
                     if(results.length){
                      for(var i = 0; i<results.length; i++){  
                              ordersListRes.push(results[i])
                          }
                     }
                     resolve(ordersListRes);
                });
          });*/
const Ebay = require("ebay-node-api");
var AliExpressSpider = require('aliexpress');
var AliexScrape = require('aliexscrape');
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
    //var statusOfOrder = req.body;
    //var awShip = req.body;
    var trackNum = post.trackNum;
    var orderNum = post.orderNum;
    var refundDate = post.refundDate;
    var reason = post.reason;

    console.log(orderNum + ' ' + supplierName + ' ' + itemName + ' ' + itemPrice + ' ' + qtySold + ' ' + refundDate + ' ' + reason);

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
                    }else if(supplierName == results[0][0].supplierName2){
                        var supItemPrice = results[0][0].supItemPrice2;
                    }else if(supplierName == results[0][0].supplierName3){
                        var supItemPrice = results[0][0].supItemPrice3;
                    }
                    //for(var i = 0 ; i< itemName.length; i++){
                    var sql = "INSERT INTO `tblorders`(`supplierName`,`itemName`,`supItemPrice`,`itemPrice`,`orderDate`,`qtySold`,`statusOfOrder`,`awShip`) VALUES ('" + supplierName + "','" + itemName + "','" + supItemPrice + "','" + results[0][0].itemPrice + "','" + orderDate + "','" + qtySold + "' ,'Pending','No')";
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
                var sql = "update tblOrders SET statusOfOrder = ? ,awShip = ?, trackNum = ? WHERE orderNum = ?";
                db.query(sql, ['ACCEPTED', 'Yes',trackNum, orderNum ], function(err, result) {
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

    if(supplierName && !itemName)loadItems();
    if(supplierName && itemName && qtySold && !orderNum)updateDB();
    if(trackNum && orderNum)editTrack();
    if(orderNum && !trackNum && !supplierName)deleteRecord();
    if(orderNum && supplierName && itemName && itemPrice)insertRefund();
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
          console.log('Get orders Details');
          db.query("SELECT * FROM `tblorders` ORDER BY orderNum DESC", function(err, results, fields)
          {
               if(results.length){
                for(var i = 0; i<results.length; i++){   
                        ordersListRes.push(results[i]);
                    }
               }
               resolve(ordersListRes);
          });
        });
  }

  function asyncFunc3() {
    return new Promise(
        function (resolve, reject) {
            console.log('Get Tracking Details');
            db.query("SELECT trackNum FROM `tblorders` ORDER BY orderNum DESC", function(err, results, fields)
            {
                 if(results.length){
                    for(var i = 0; i<results.length; i++){
                        id.push(results[i].trackNum);
                    }

                    function delay() {
                        return new Promise(resolve => setTimeout(resolve, 300));
                       }
                      async function delayedLog(tracking) {
                          if(tracking != null){
                        geartrack.cainiao.getInfo(tracking, (err, TrakerInfo) => {
                            if(err) { return }
                            trakeInfo.push(TrakerInfo);
                            if(TrakerInfo.states.length != 0){
                                for(var i = TrakerInfo.states.length-1; i > 0 ; i-- ){
                                    arr[i] = TrakerInfo.states[i].state.split(' ')
                                    for(var j = 0; j < arr[i].length ; j++){
                                        //console.log(arr[i][j])
                                        if(arr[i][j] == 'delivered' || arr[i][j] == 'delivery'){
                                            var sql = "update tblOrders SET statusOfOrder = ? WHERE trackNum = ?";
                                            db.query(sql, ['DELIVERED', tracking], function(err, result) {
                                            })
                                        }
                                        if(arr[i][j] == 'transit.' || arr[i][j] == 'Accepted' || arr[i][j] == 'Acceptance'){
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

function main() {
    asyncFunc()
    .then(result => {
        answer.supplierNameRes = supplierNameRes;
        return asyncFunc2();
    })
    .then(result2 => {
        answer.ordersListRes = ordersListRes;
        return asyncFunc3();
    })
    .then(async result3 => {
        //setTimeout(function(){
            answer.trakeInfo = trakeInfo;
            res.render('orders_page',{answer:answer});
        //}, 1000);
        //res.render('orders_page',{answer:answer}); 
    })
    .catch(error => {});
  }
  main();



  }
}

  /*async function asyncTask () {
    try {
      const valueA = await asyncFunc()
      answer.supplierNameRes = supplierNameRes;
      const valueB = await asyncFunc2(valueA)
      answer.ordersListRes = ordersListRes;
      const valueC = await asyncFunc3(valueB)
      console.log(valueC);
      answer.trakeInfo = trakeInfo;
      return await asyncFunc3(valueB)
      //return await functionD(valueC)
      res.render('orders_page',{answer:answer})
    } catch (err) {
      console.log(err)
    }
  }

  asyncTask();*/

        /*var courier = tracker.courier(tracker.COURIER.CJKOREAEXPRESS.CODE)
        var trace_number = 'LY606209059CN';
        courier.trace(trace_number, function (err, result1) {
          console.log(result1)
        })*/

/*let ebay = new Ebay({
    clientID: "EladPint-DSMHome-PRD-0820665a8-01939c18",
    clientSecret: 'PRD-820665a8505f-4612-4733-8f5a-52eb',
    body: {
        grant_type: "client_credentials",
        scope: "https://api.ebay.com/oauth/api_scope"
    }
});

ebay.getAccessToken()
    .then((data) => {
        ebay.searchItems({
            keyword: "samsung",
            limit: 2,
            
        }).then((data) => {
            console.log(data);
            // Data is in format of JSON
            // To check the format of Data, Go to this url (https://developer.ebay.com/api-     docs/buy/browse/resources/item_summary/methods/search#w4-w1-w4-SearchforItemsbyKeyword-0)
        })
    });*/

/*ebay.getAccessToken().then((data) => {
    //console.log(data.access_token); // data.access_token
    var e = ["273421268275", "273421242051"];
    for(var i=0; i<2; i++){
    ebay.getItemByItemGroup(e[i]).then((data) => {
        // Data is in format of JSON
        // To check the format of Data, Go to this url (https://jsonblob.com/56cbea67-30b8-11e8-953c-5d1886dcf4a0)
        var obj = JSON.parse(data);
        console.log(obj.items[0].price)
    })}
}, (error) => {
    console.log(error);
});*/


      /*AliExpressSpider.Search({
        keyword: 'kids toys superman',
        page: 1

      }).then(function(data){
          for(var i=0; i<5 ; i++){
        console.log('Item data: ', data.list[i]);
          }
      })*/

      /*AliexScrape('32825350607') // 32853590425 is a productId
      .then(response => {
        var obj = JSON.parse(response);
        console.log(obj.variations[0].pricing)})
      .catch(error => console.log(error));*/

      
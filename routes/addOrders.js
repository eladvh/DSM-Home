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
var message = '';
var answer = {sendName, message, itemsNameRes, supplierNameRes, ordersListRes}

var userId = req.session.userId;
  


if(userId == null){
   res.redirect("/login");
   return;
}
if(req.method == "POST"){

    var post  = req.body;
    var supplierName = post.supplierName
    var itemName = post.itemName;
    var itemPrice = post.itemPrice;
    var orderDate = post.orderDate;
    var qtySold = post.qtySold;
    var statusOfOrder = 'PENDING';
    var awShip = 'YES';
    var trackNum = post.trackNum;
    var orderNum = post.orderNum;
    var reason = post.reason;
    console.log(supplierName + ' ' + itemName + ' ' + itemPrice + ' ' + qtySold + ' ' + reason);

    function asyncFunc() {
        return new Promise(
          function (resolve, reject) { 
            console.log('Get Item Details');
            db.query("Call Get_itemName_By_SupplierName('"+ supplierName +"')", function(err, results, fields)
            {
                 if(results.length){
                for(var i = 0; i<results[0].length; i++ ){     
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
                db.query("SELECT itemPrice FROM `tblItems` WHERE `itemName`='"+itemName+"'", function(err, results, fields){
                if(results.length){
                var sql = "INSERT INTO `tblorders`(`supplierName`,`itemName`,`itemPrice`,`orderDate`, `qtySold`,`statusOfOrder`,`awShip`) VALUES ('" + supplierName + "','" + itemName + "','" + results[0].itemPrice + "','" + orderDate + "','" + qtySold + "' ,'" + statusOfOrder + "','" + awShip + "')";
                var query = db.query(sql, function(err, result) {
                  if(result.length){
                  console.log('success');
                  console.log(result);
                  }
                })
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
                db.query(sql, ['ACCEPTED', 'NO',trackNum, orderNum ], function(err, result) {
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
                var sql = "INSERT INTO `tblRefunds`(`supplierName`,`itemName`,`refundAmount`,`qtyRefunded`,`reason`) VALUES ('" + supplierName + "','" + itemName + "','" + itemPrice*qtySold + "','" + qtySold + "' ,'" + reason + "')";
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
    if(supplierName && itemName && !orderNum)updateDB();
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


function main() {
    asyncFunc()
    .then(result => {
        answer.supplierNameRes = supplierNameRes;
      return asyncFunc2();
    })
    .then(result2 => {
        answer.ordersListRes = ordersListRes;
        res.render('orders_page',{answer:answer});
    })
    .catch(error => {});
  }
  main();




  }
}



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

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
    var answer = {sendName, message};
  
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

      function asyncFunc() {
        return new Promise(
            function (resolve, reject) {
                  console.log('Update DB'); 
                  var sql = "INSERT INTO `tblItems`(`itemName`,`storeItemLink`, `itemPic`,`category`, `itemPrice`) VALUES ('" + itemName + "','" + storeItemLink + "','" + itemPic + "' ,'" + category + "','" + itemPrice + "')";
                  var query = db.query(sql, function(err, result) {
                    if(result.length){
                    console.log('success');
                    }      
                  })
                  answer.message = "Succesfully! New item has been listed.";
                  resolve(answer.message);
        })
      }

      function mainPost() {
        asyncFunc()
        .then(result => {
            console.log(answer);
            res.send(answer);
        })
      /*  })
        .then(result2 => {
    
          answer.logsListRes = logsListRes;
          console.log(answer.logsListRes);
          res.send(answer);
        })*/
        .catch(error => {});
      }
    
    mainPost();

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
    
    
      function main() {
        asyncFunc()
        .then(result => {
          answer.itemListRes = itemListRes;
          console.log(answer.itemListRes);
          res.render('item_page',{answer:answer});
        })
        .catch(error => {});
      }
      main();
    }
  }
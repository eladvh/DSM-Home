 //-----------------------------------------------add suppliers page----------------------------------------------------------------

 exports.addsup = function(req, res){
    console.log('add suppliers page');
    var user =  req.session.user;
    var sendName = user.first_name + ' ' + user.last_name;
    var suppliersListRes = [];
    post = [];
    var answer = {suppliersListRes ,post, message: '', p: 0, sendName};
    
    var userId = req.session.userId;
    if(userId == null){
       res.redirect("/login");
       return;
    }
    if(req.method == "POST"){
      var post  = req.body;
      var supplierName = post.supplierName;
      var storeNum = post.storeNum;
      var storeLink = post.storeLink;
      var establishYear = post.establishYear;
      var email = post.email;
      var wechat = post.wechat;
      var skypeID = post.skypeID;
      var phoneNum = post.phoneNum;

      function asyncFunc() {
        return new Promise(
            function (resolve, reject) {
                var sql="SELECT * FROM `tblSuppliers` WHERE `storeNum`='"+storeNum+"'"; 
                var query = db.query(sql, function(err, results) {
                if(results.length){
                    var q = results[0];
                    console.log('check if ' + storeNum + ' = ' + q.storeNum + ' ?');
                    if(storeNum == q.storeNum){
                      console.log("duplicate");
                      answer.message = "duplicate";
                    }}else{
                console.log('Update DB'); 
                var sql = "INSERT INTO `tblSuppliers`(`supplierName`,`storeNum`, `storeLink`,`establishYear`, `wechat`, `email`,`skypeID`, `phoneNum`) VALUES ('" + supplierName + "','" + storeNum + "','" + storeLink + "' ,'" + establishYear + "','" + wechat + "' ,'" + email + "' ,'" + skypeID + "' ,'" + phoneNum + "')";
                var query = db.query(sql, function(err, result) {
                  console.log('success');
                  
                  });
                  answer.message = "Succesfully! supplier tab has been created.";
                }
                  resolve(answer.message);
                
            });
        })
      }


      function mainPost() {
        asyncFunc()
        .then(result => {
            console.log(answer);
            res.send(answer);
        })
        .catch(error => {});
      }
    
    mainPost();
    }else{
  
    function asyncFunc() {
      return new Promise(
          function (resolve, reject) {
            console.log('Get Suppliers Details');
            db.query("SELECT * FROM `tblSuppliers` ORDER BY supplierName", function(err, results, fields)
            {
                 if(results.length){
                for(var i = 0; i<results.length; i++ ){     
                          suppliersListRes.push(results[i]);
                    }
                 }
                 resolve(suppliersListRes);
            });
          });
    }
  
  
    function main() {
      asyncFunc()
      .then(result => {
        answer.suppliersListRes = suppliersListRes;
        res.render('addsup_page',{answer:answer});
      })
      .catch(error => {});
    }
    main();
}
  }
  
  //-----------------------------------------------Search New Supplier----------------------------------------------------------------
  var AliExpressSpider = require('aliexpress');
  exports.searchsup = function(req, res){

    console.log('add suppliers page');
    var user =  req.session.user;
    var sendName = user.first_name + ' ' + user.last_name;
    var suppliersData= [];
    var answer = {sendName, suppliersData};
    
    var userId = req.session.userId;
    if(userId == null){
       res.redirect("/login");
       return;
    }
    if(req.method == "POST"){
      var post  = req.body;
      var search = post.search;
      var qty = post.qty;
      console.log(qty + '' + search)

        AliExpressSpider.Search({
        keyword: search,
        page: 3

      }).then(function(data){
          for(var i=0; i<qty ; i++){
            suppliersData.push(data.list[i].store);
        console.log('Item data: ', data.list[i].store);
          }
          answer.suppliersData = suppliersData;
          res.send(answer);
      })
    }else{
    res.render('serachsup_page',{answer:answer});
  }
  }
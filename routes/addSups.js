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
                  //answer.message = "Succesfully! supplier tab has been created.";
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
  
    /*if(req.method == "POST"){
      var post  = req.body;
      console.log(req.body);
      var storeNum= post.storeNum;
      var supplierName = post.supplierName;
      var establishYear= post.establishYear;
      var storeLink= post.storeLink;
      var wechat= post.wechat;
      var email= post.email;
      var skypeID= post.skypeID;
      var phoneNum= post.phoneNum;
  
      answer = {post, message: '', p: 0, sendName};
      console.log(answer);
  
      var sql="SELECT storeNum, supplierName, establishYear, storeLink, wechat, email,skypeID, phoneNum FROM `tblSuppliers` WHERE `storeNum`='"+storeNum+"'"; 
      var query = db.query(sql, function(err, results) {
        if(results.length){
          var q = results[0];
          console.log('check if ' + answer.post.storeNum + ' = ' + q.storeNum + ' ?');
  
          if(answer.post.storeNum == q.storeNum){
            
            console.log("duplicate");
            answer.message = "duplicate";
            answer.p = 1;
            
            res.render('addsup_page.ejs',{answer:answer});
          }}else{
            var sql = "INSERT INTO `tblSuppliers`(`storeNum`,`supplierName`,`establishYear`, `storeLink`, `wechat`, `email`,`skypeID`, `phoneNum` ) VALUES ('" + storeNum + "','" + supplierName + "','" + establishYear + "','" + storeLink + "' ,'" + wechat + "' ,'" + email + "' ,'" + skypeID + "' ,'" + phoneNum + "')";
            var query = db.query(sql, function(err, result) {
              answer.message = "Succesfully! supplier tab has been created.";
              console.log('success');
              answer.p = 1;
              res.render('suppliers.ejs',{answer:answer});
            })
          }
  
      })
    }else{
      res.render('addsup_page', {answer:answer});
    }*/
  
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
  
  
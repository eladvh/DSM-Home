 //-----------------------------------------------analitics page----------------------------------------------------------------
 exports.analytics = function(req, res){

    console.log('analytics page');
    var user =  req.session.user;
    var sendName = user.first_name + ' ' + user.last_name;
    var supOrdSumListRes = [];
    var answer = {sendName, supOrdSumListRes};
  
    var userId = req.session.userId;
  
    if(userId == null){
       res.redirect("/login");
       return;
    }
  
    if(req.method == "POST"){
      var message = "check if work";
      res.send(message);
    }

  
    function asyncFunc() {
        return new Promise(
            function (resolve, reject) {
              console.log('items sold by supplier');
              db.query("SELECT supplierName, sum(itemPrice*qtySold) AS Sum FROM `tblorders` GROUP BY supplierName HAVING Sum > 100", function(err, results, fields)
              {
                   if(results.length){
                    for(var i = 0; i<results.length; i++){   
                        supOrdSumListRes.push(results[i]);
                    }
                   }
                   resolve(supOrdSumListRes);
              });
            });
      }
    
    
    function main() {
        asyncFunc()
        .then(result => {
            answer.supOrdSumListRes = supOrdSumListRes;
            console.log(answer.supOrdSumListRes);
            res.render('analytics', {answer:answer});
        })
        .catch(error => {});
      }
      main();
    


  }
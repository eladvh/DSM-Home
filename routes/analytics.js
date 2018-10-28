 //-----------------------------------------------analitics page----------------------------------------------------------------
 exports.analytics = function(req, res){

    console.log('analytics page');
    var user =  req.session.user;
    var sendName = user.first_name + ' ' + user.last_name;
    var supplierNameRes = [];
    var supOrdSumListRes = [];
    var supRefunds = '';
    var answer = {sendName, supOrdSumListRes, supplierNameRes};
  
    var userId = req.session.userId;
  
    if(userId == null){
       res.redirect("/login");
       return;
    }
  
    if(req.method == "POST"){
        var post  = req.body;
        var supplierName = post.supplierName;
        var firstDate = post.firstDate;
        var secondDate = post.secondDate;


        function asyncFunc() {
            return new Promise(
              function (resolve, reject) {
                console.log('Get Num Of Refunds'); 
                db.query(`CALL Get_num_of_supplier_refunds_by_suppliername(${supplierName}, ${firstDate}, ${secondDate})`, function(err, results, fields){
                    if(results[0].length){
                        supRefunds = results[0][0].numoOfRefunds;
                    }
                    resolve(supRefunds);
                })
          })
        }
        
        function getRefundsNum() {
            asyncFunc()
            .then(result => {
                console.log(supRefunds)
                res.send(answer)
            })
            .catch(error => {});
        }
        if(supplierName && firstDate && secondDate)getRefundsNum();
    }

  
function asyncFunc() {
    return new Promise(
        function (resolve, reject) {
          console.log('Get Suppliers Names List');
          db.query("SELECT DISTINCT supplierName FROM `tblSuppliers`", function(err, results, fields)
          {
               if(results.length){
              for(var i = 0; i < results.length; i++ ){     
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
            res.render('analytics', {answer:answer});
        })
        .catch(error => {});
      }
      main();
    


  }
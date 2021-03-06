 //-----------------------------------------------analitics page----------------------------------------------------------------
 exports.analytics = function(req, res){

    console.log('analytics page');
    var user =  req.session.user;
    var sendName = user.first_name + ' ' + user.last_name;
    var supplierNameRes = [];
    var supOrdSumListRes = [];
    var supRefundsQty = [];
    var supRefundsDates = [];
    var supRefundsNum = '';
    var supOrdersQty = [];
    var supOrdersDates = [];
    var supOrdersNum = [];
    var monthCalc = [];
    var monthCalc1 = [];
    var expensesSummary = [];
    var revenueSummary = [];

    var answer = {sendName, supOrdSumListRes, supplierNameRes};
    var refundAnswer = {sendName, supRefundsQty, supRefundsDates, supRefundsNum}
    var orderAnswer = {sendName, supOrdersQty, supOrdersDates, supOrdersNum}
    var revenueAnswer = {sendName, monthCalc, revenueSummary}
    var expensesAnswer = {sendName, monthCalc1, expensesSummary}
    var userId = req.session.userId;
  
    if(userId == null){
       res.redirect("/login");
       return;
    }
  
    if(req.method == "POST"){
        var post  = req.body;
        var supplierName1 = post.supplierName1;
        var supplierName2 = post.supplierName2;
        var firstDate = post.firstDate;
        var secondDate = post.secondDate;
        console.log(post)

        function asyncFunc() {
            return new Promise(
              function (resolve, reject) {
                console.log('Get Num Of Refunds'); 
                db.query('CALL Get_num_of_supplier_refunds_by_suppliername("'+supplierName1+'","'+firstDate+'","'+secondDate+'")', function(err, results, fields){
                    if(results[0].length){
                        for(i = 0; i < results[0].length; i++){
                            supRefundsDates.push(results[0][i].refundDate)
                            supRefundsQty.push(results[0][i].numOfRefunds) 
                        }
                        refundAnswer.supRefundsNum = results[0].length;
                    }
                    resolve();
                })
          })
        }

        function asyncFunc2() {
            return new Promise(
              function (resolve, reject) {
                console.log('Get Num Of Orders'); 
                db.query('CALL Get_num_of_supplier_orders_by_suppliername("'+supplierName2+'","'+firstDate+'","'+secondDate+'")', function(err, results, fields){
                    if(results[0].length){
                        for(i = 0; i < results[0].length; i++){
                        supOrdersQty.push(results[0][i].numOfOrders)
                        supOrdersDates.push(results[0][i].orderDate)
                        }
                        orderAnswer.supOrdersNum = results[0].length;
                    }
                    resolve();
                })
          })
        }
        
        function getRefundsNum() {
            asyncFunc()
            .then(result => {
                console.log(refundAnswer)
                res.send(refundAnswer)
            })
            .catch(error => {});
        }

        function getOrdersNum() {
            asyncFunc2()
            .then(result => {
                console.log(orderAnswer)
                res.send(orderAnswer)
            })
            .catch(error => {});
        }

        if(supplierName1 && firstDate && secondDate)getRefundsNum();
        if(supplierName2 && firstDate && secondDate)getOrdersNum();

    }else{

  
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
    
  function asyncFunc2() {
    return new Promise(
        function (resolve, reject) {
          console.log('Get User Revenue');
          db.query("CALL Get_revenue_by_supplier", function(err, results, fields)
          {
            if(results[0].length){
                for(var i = 0; i < results[0].length; i++){
                    monthCalc.push(results[0][i].Month)
                    revenueSummary.push(results[0][i].totalUserRevenue)
                }
            }
            resolve();
          })  
        });
  }

  function asyncFunc3() {
    return new Promise(
        function (resolve, reject) {
          console.log('Get User Expenses');
          db.query("CALL Get_expenses_by_supplier", function(err, results, fields)
          {
            if(results[0].length){
                for(var i = 0; i < results[0].length; i++){
                    monthCalc1.push(results[0][i].Month)
                    expensesSummary.push(results[0][i].totalUserExpenses)
                }
            }
            resolve();
          })  
        });
  }
    
    
    function main() {
        asyncFunc()
        .then(result => {
            return asyncFunc2();
        }).then(result => {
            console.log(revenueAnswer)
            return asyncFunc3();
        }).then(result => {
            console.log(expensesAnswer)
            res.render('analytics', {answer:answer,revenueAnswer:revenueAnswer,expensesAnswer:expensesAnswer});
        })
        .catch(error => {});
      }
      main();
    

    }
  }
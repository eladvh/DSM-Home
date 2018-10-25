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
  const request = require('request');
  const cheerio = require("cheerio");
  const puppeteer = require('puppeteer');
  const prompt = require('prompt');
  const AliExpressSpider = require('aliexpress');

  exports.searchsup = function(req, res){

    console.log('add suppliers page');
    var user =  req.session.user;
    var sendName = user.first_name + ' ' + user.last_name;
    var suppliersData= [];
    var contactData = [];
    var answer = {sendName, suppliersData, contactData};
    
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



        function asyncFunc() {
        return new Promise(
          async function (resolve, reject) {
              console.log('get_aliexpress_data');
                await AliExpressSpider.Search({
                keyword: search,
                page: 3
        
              }).then(data => {
                  for(var i = 0; i < qty ; i++){
                    suppliersData.push(data.list[i].store);
                    console.log('Item data: ', data.list[i].store);
                  }
              })
              resolve(suppliersData);
            });
      }
    
      /*function asyncFunc2() {
        return new Promise(
           async function (resolve, reject) {
              console.log('get_contact_data');

              async function getContactData(){
              var url = suppliersData[i].url;
              url = `https:${url}`;
              console.log(url)
              request(url, await function (error, response, body) {
                if(!error){
                  var $ = cheerio.load(body);
                  var dataid1 = $('#j-store-header > div > div > div.store-info-header.util-clearfix > div.store-operate-box > div.store-contact > span > a').attr('data-id1');
                  var dataid2 = $('#j-store-header > div > div > div.store-info-header.util-clearfix > div.store-operate-box > div.store-contact > span > a').attr('data-id2');
                  var link = `https://message.aliexpress.com/message/new.htm?memberSeq=${dataid1}&storeId=${dataid2}&messageType=store&memberType=seller&refer=${url}`
                  contactData.push(link);
                }
              });
              }
              
              for(var i = 0; i < suppliersData.length; i++){
              var get = await getContactData()
              }
              //setTimeout(() => {
                resolve(get);
              //}, 4000);
              
            });
      }*/
    

      function main() {
        asyncFunc()
        .then(result => {
          answer.suppliersListRes = suppliersListRes;
          res.render('addsup_page',{answer:answer});
        })
        .catch(error => {});
      }

      function main() {
        asyncFunc()
        .then(result => {
          answer.suppliersData = suppliersData;
          res.send(answer);
        })
        .catch(error => {});
      }
        /*}).then(result2 => {
          return asyncFunc2();
          answer.contactData = contactData;
          console.log(contactData);
          res.send(answer);
        }).catch(error => {});*/

      main();

    }else{
      /*var url = '//www.aliexpress.com/store/439970';
      url = `https:${url}`;
      console.log(url)
      request(url, function(error, response, body) {
        if(!error){
          var $ = cheerio.load(body);
          var dataid1 = $('#j-store-header > div > div > div.store-info-header.util-clearfix > div.store-operate-box > div.store-contact > span > a').attr('data-id1');
          var dataid2 = $('#j-store-header > div > div > div.store-info-header.util-clearfix > div.store-operate-box > div.store-contact > span > a').attr('data-id2');
          console.log(dataid1)
          var link = `https://message.aliexpress.com/message/new.htm?memberSeq=${dataid1}&storeId=${dataid2}&messageType=store&memberType=seller&refer=${url}`
          console.log(link);
        
          //contactData.push(link);
        }
      });*/

    res.render('serachsup_page',{answer:answer});
  }
  }


  /*async function main() {
const browser = await puppeteer.launch({headless: false});
const page = await browser.newPage();
await page.setViewport({width: 1200, height: 720})
await page.goto('https://login.aliexpress.com/', { waitUntil: 'networkidle0' }); // wait until page load
const credentials = await new Promise( ( resolve, reject ) =>
{
    prompt.get( [ 'username', 'password' ], ( error, result ) =>
    {
        resolve( result );
    });
});

const username = credentials.username;
const password = credentials.password;
await page.focus('#fm-login-id');
await page.type( '#fm-login-id', username );
await page.focus('#fm-login-password');
await page.type( '#fm-login-password', password );
// click and wait for navigation
await Promise.all([
          page.click('#loginSubmit'),
          page.waitForNavigation({ waitUntil: 'networkidle0' }),
]);
}

main();*/
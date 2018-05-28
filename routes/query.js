var sql = require('mssql');

module.exports =  function (cp) {

cp.connect().then(function() {
  console.log('Connection pool open for duty');
  var request = new sql.Request(cp);
      request.query("select * from Users").then(function (recordSet) {
        console.log(recordSet);
      }); 
    }).catch(function(err) {
      console.error('Error creating connection pool', err);
    }); 
    }; 
  

  /*var request = new sql.Request(cp);
  request.query("INSERT INTO [Users] (Usermail, Userpassword) VALUES ('"+global.username+"', '"+global.password+"')").then(function(recordset) {
    //console.log('Recordset: ' + recordset);
    //console.log('Affected: ' + request.rowsAffected);
    console.log(recordset);
  });*/

      
  /*var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

  }); */



/*
module.exports = function (cp) {
  var me = {
    get: function (req, res, next) {
        console.log('111asdsad');
      var request = new sql.Request(cp);
      request.query("select * from Users").then(function (err, recordSet) {
        console.log(recordSet);
      //request.query('select * from Users', function(err, recordset) {
        if (err) {
          console.error(err);
          res.status(500).send(err.message);
          return;
        }
        res.status(200).json(recordset);
        console.log(recordset);
      });
    }
  };

  return me;
}; 

console.log('success');
*/


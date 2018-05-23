var sql = require('mssql');
    

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



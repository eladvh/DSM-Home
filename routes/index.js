var express = require('express');
var router = express.Router();

//router.get('/', function(req, res, next) {
  //res.sendfile('public/index.html');
  //res.status(200).send('home page');
  //res.render('index', { title: 'Express' });
//});
/* GET home page. */
router.get('/elad', function(req, res, next) {
  //res.sendfile('public/index.html'); ;
  res.status(200).send('Hi elad');
  //res.render('index', { title: 'Express' });

});

module.exports = router;

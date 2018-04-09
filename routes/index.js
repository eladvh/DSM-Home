var express = require('express');
var app     = express();
var path    = require("path");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.sendfile('public/index.html'); ;
  res.status(200).send('Hi eladp!');
  //res.render('index', { title: 'Express' });

});

module.exports = router;

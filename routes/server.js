var express = require('express')
  , routes = require('../routes')
  , user = require('../routes/user')
  , index = require('../routes/index')
  , http = require('http')
  , path = require('path');
var app = express();
var db = require('../db');



/*app.get('/home/userProfile', function (req, res) {
  res.sendfile('../views/profile.html')
})*/

//app.post('/routes/user.js', user.login);
//app.get('/routes/user.js', index.index);//call for main index page
app.get('/', index.index);//call for main index page
app.get('/signup', user.signup);//call for signup page
app.post('/signup', user.signup);//call for signup post 
app.get('/login', index.index);//call for login page
app.post('/login', user.login);//call for login post
app.get('/home/dashboard', user.dashboard);//call for dashboard page after login
app.get('/home/logout', user.logout);//call for logout
app.get('/home/userProfile', index.userProfile);
//app.post('/home/userProfile', index.userProfile1);
//app.get('/home/profile',user.profile);//to render users profile


module.exports = app;



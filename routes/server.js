var express = require('express')
  , routes = require('../routes')
  , user = require('../routes/user')
  , http = require('http')
  , path = require('path');
var app = express();
var db = require('../db');

 
app.get('/', routes.index);//call for main index page
app.get('/signup', user.signup);//call for signup page
app.post('/signup', user.signup);//call for signup post 
app.get('/login', routes.index);//call for login page
app.post('/login', user.login);//call for login post
app.get('/home/dashboard', user.dashboard);//call for dashboard page after login
app.get('/home/logout', user.logout);//call for logout
app.get('/home/profile',user.profile);//to render users profile



module.exports = app;
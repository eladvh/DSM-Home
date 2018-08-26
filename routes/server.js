var express = require('express')
  , routes = require('../routes')
  , user = require('../routes/user')
  , index = require('../routes/index')
  , addLogs = require('../routes/addLogs')
  , http = require('http')
  , path = require('path');
var app = express();
var db = require('../db');


app.get('/', index.index);//call for main index page
app.get('/signup', user.signup);//call for signup page
app.post('/signup', user.signup);//call for signup post 
app.get('/login', index.index);//call for login page
app.post('/login', user.login);//call for login post
app.get('/home/dashboard', user.dashboard);//call for dashboard page after login
app.get('/home/logout', user.logout);//call for logout
app.get('/home/editProfile', user.editprofile);//edit users details
app.post('/home/editProfile', user.editprofile);//edit users details
app.get('/home/profile',user.profile);//to render users profile
app.get('/home/suppliers', index.suppliers);//to render suppliers page
app.post('/home/suppliers', index.suppliers);//call for suppliers post
app.get('/home/suppliers/logs', addLogs.addLogs);//call for logs_page
app.post('/home/suppliers/logs', addLogs.addLogs);//call for logs_page post
app.get('/home/suppliers/addsup', index.addsup);//call for addsup_page page 
app.post('/home/suppliers/addsup', index.addsup);//call for addsup_page post
app.get('/home/analitics', index.analitics);//call for analitics page 
app.post('/home/analitics', index.analitics);//call for analitics post page 

module.exports = app;



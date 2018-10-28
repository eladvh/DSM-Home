const express = require('express')
const routes = require('../routes')
const user = require('../routes/user')
const index = require('../routes/index')
const addLogs = require('../routes/addLogs')
const addSups = require('../routes/addSups')
const addItems = require('../routes/addItems')
const addOrders = require('../routes/addOrders')
const analytics = require('../routes/analytics')
const http = require('http')
const path = require('path');
const app = express();
const db = require('../db');
const multer  = require('multer')
const upload = multer({ dest: 'public/uploads' })

app.get('/', index.index);//call for main index page
app.get('/signup', user.signup);//call for signup page
app.post('/signup', user.signup);//call for signup post 
app.get('/login', index.index);//call for login page
app.post('/login', user.login);//call for login post
app.get('/home/dashboard', user.dashboard);//call for dashboard page after login
app.get('/home/logout', user.logout);//call for logout
app.get('/home/profile',user.profile);//to render users profile page
app.post('/home/profile',user.profile);//to render users profile post page
app.get('/home/suppliers', index.suppliers);//to render suppliers page
app.post('/home/suppliers', index.suppliers);//call for suppliers post
app.get('/home/suppliers/logs', addLogs.addLogs);//call for logs_page
app.post('/home/suppliers/logs', addLogs.addLogs);//call for logs_page post
app.get('/home/suppliers/addsup', addSups.addsup);//call for addsup_page page 
app.post('/home/suppliers/addsup', addSups.addsup);//call for addsup_page post
app.get('/home/suppliers/searchsup', addSups.searchsup);//call for searchsup_page page 
app.post('/home/suppliers/searchsup', addSups.searchsup);//call for searchsup post
app.get('/home/suppliers/addItem', addItems.addItem);//call for item page 
app.post('/home/suppliers/addItem', upload.single('excel'), addItems.addItem);//call for item page post
app.get('/home/suppliers/addItemAuto', addItems.addItemAuto);//call for auto item page 
app.post('/home/suppliers/addItemAuto', addItems.addItemAuto);//call for auto item page post
app.get('/home/suppliers/addOrder', addOrders.addOrder);//call for orders_page page 
app.post('/home/suppliers/addOrder', addOrders.addOrder);//call for products_page post
app.get('/home/analytics', analytics.analytics);//call for analytics page 
app.post('/home/analytics', analytics.analytics);//call for analytics post page 

module.exports = app;



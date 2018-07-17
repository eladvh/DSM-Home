var express = require('express');
var app = express();

app.use(express.static(dirname + '/public'));

app.get('/login', function(req,res) {
    var data = {
        contactID: 1,
        firstName: 'Elad',
        lastName: 'Pinto',
        email: 'Eladvh@gmail.com',
        phone: '987654'
    };

    res.send(data);
});
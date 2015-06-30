var http = require('http')
var async = require('async');
//var express = require('express');
var restify = require('restify');
var jwt = require('jwt-simple');

var server = restify.createServer();
server.use(restify.bodyParser({mapParams: true}));

var users = [
    {
        username: 'Gerald',
        password: 'password',
        role: 'user'
    },
    {
        username: 'admin',
        password: 'password',
        role: 'admin'
    }
];

var secret = 'secret';


var authenticate = function(username, password) {

    var result = null;
    users.forEach( function(item) {
        if (item.username == username && item.password == password)
            result = item;
    });
    return result;
};


server.post('/oauth/token', function(req, res, next) {

    var data = authenticate(req.params.username, req.params.password);
    var token = jwt.encode(data, secret);

    var result = {
        token_type: 'bearer',
        access_token: token,
        expires_in: 86399
    };

    res.send(result);
    next();
});

server.get('/rest/test1', function(req, res, next) {

    var token = req.header('Authorization');
    console.log('got token: ' + token);

    var parts = token.split(' ');
    var jwtoken = parts[1];

    var decoded = jwt.decode(jwtoken, secret);
    console.log('decoded: ' + decoded);

    res.send(token);
    next();
});



server.get('/test/users', function(req, res, next) {

    var token = req.header('Authorization');
    var parts = token.split(' ');
    var jwtoken = parts[1];

    var decoded = jwt.decode(jwtoken, secret);

    var users = [
        {
            username: 'admin'
        },
        {
            username: 'super'
        }
    ];


    res.send(users);
    next();
});



server.listen(process.env.PORT || 1337, function() {
    console.log('%s listening at %s', server.name, server.url);
});


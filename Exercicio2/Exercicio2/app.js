var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    http = require('http'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');
	
var LocalStrategy = require('passport-local').Strategy;

var db = require('./model/db'),
    produto = require('./model/produtos');
	
var	LocalStrategy = require('passport-local').Strategy;

var routes = require('./routes/index'),
    produtos = require('./routes/produtos');

//var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.set('view options', { layout: false });

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/produtos', produtos);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

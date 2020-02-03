var debug = require('debug')('homadataapi:app');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
const result = dotenv.config();
debug(result);

var apiRoutes = require('./app/routes/index');

var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//enable cors for localhost testing
app.use(function(req, res, next) {
    const origin = req.headers.origin;
    const firebaseAppURL = 'https://homadata-app.firebaseapp.com/';
    if (/^http:\/\/localhost(\.\w+)*(:[0-9]+)?\/?$/.test(origin) || origin === firebaseAppURL) {
        res.header("Access-Control-Allow-Origin", origin);
        res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    }
    next();
});

app.use('/api', apiRoutes);
app.get('/', function(req, res) {
    res.send({ message: "Welcome! the API is UP and RUNNING !" });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    const { status = 500, message, code } = err;
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    const errorData = { error: true, message, code };
    res.status(status).send(errorData);
});

module.exports = app;
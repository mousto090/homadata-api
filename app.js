var debug = require('debug')('homadataapi:app');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var dotenv = require('dotenv');
const result = dotenv.config();
debug(result);

var apiRoutes = require('./app/routes/index');

var app = express();

//enable cors to access api form firebase
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
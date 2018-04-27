var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var fs = require('fs')
var cors = require('cors')

var index = require('./routes/index');
var technology = require('./routes/technology');
var employee = require('./routes/employee');
var plan = require('./routes/plan');
var enrollment = require('./routes/enrollment');
var users = require('./routes/users');
var attendance = require('./routes/attendance');
var trainedEmployee = require('./routes/trainedEmployee');

var app = express();
app.use(cors());
var db = mongoose.connect('mongodb://localhost:27017/tnd');

var models_path = __dirname + '/models';
/*var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        //console.log(file);
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/technology', technology);
app.use('/employee', employee);
app.use('/plan', plan);
app.use('/enrollment', enrollment);
app.use('/user', users);
app.use('/attendance', attendance);
app.use('/trained-employee', trainedEmployee);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
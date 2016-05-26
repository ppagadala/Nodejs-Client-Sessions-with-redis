var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var sessions = require('client-sessions');
var routes = require('./routes/index');
var register = require('./routes/register');
var login = require('./routes/login');
var dashboard = require('./routes/dashboard');
var user = require('./lib/middileware/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({type:'application/*+json'}));
app.use(express.static(path.join(__dirname, 'public')));


app.use(sessions({
  cookieName: 'session',
  secret: 'abcdefghijklmnopqrstuvwxyz',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,    
}));

app.use('/', routes);
app.use(user);
app.use(app.router);

app.get('/dashboard',requireLogin,dashboard.page);
app.get('/register', register.form);
app.post('/register',bodyParser.json(), register.submit);
app.get('/login', login.form);
app.post('/login',bodyParser.json(), login.submit);
app.get('/logout', login.logout);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

function requireLogin(req,res,next){
    if(!req.session.user)
        res.redirect('/login');
    else
        next();
}
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

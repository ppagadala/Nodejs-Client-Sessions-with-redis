var User = require('../lib/user');


exports.form = function(req,res){
    res.render('login',{title: 'Login'});
};

exports.submit = function(req,res,next){    
    var data = req.body;
    User.authenticate(data.username,data.password,function(err,user){
        if(err)
            return next(err);
        if(user){            
            req.session.user = user;
            //res.locals.user = user;
            res.redirect('/dashboard');            
        }else{
            var error = "Sorry! invalid credemtials.";
            res.redirect('/login');
        }
    });
};

exports.logout = function(req, res){
  req.session.reset();
  res.redirect('/');
};

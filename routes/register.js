var User = require('../lib/user');

exports.form = function(req,res){
    res.render('register',{title: 'Register'});
};


exports.submit = function(req,res,next){
    var data = req.body;
    User.getByName(data.username,function(err,userDetails){
        if(err)
            return next(err);
        if(userDetails.id){
            var error = 'Username already available';
            res.redirect('/register');
        }else{
            user = new User({
               name: data.username,
               pass: data.password,
               age : data.age  
            });            
            user.save(function(err){
                if(err)
                    return next(err);
                else{
                    req.session.user = user;                
                    res.redirect('/dashboard');
                }    
            });    
        }
    });
};


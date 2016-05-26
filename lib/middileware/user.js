var User = require('../user');

module.exports = function(req,res,next){
    var user = req.session.user;
    if(!user)
        return next();
    User.get(user.id,function(err,user){
        if(err)
            return next(err);        
        req.user = res.locals.user = user;        
        next();
    });
};
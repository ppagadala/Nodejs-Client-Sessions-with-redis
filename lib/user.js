var redis = require('redis');
var bcrypt = require('bcryptjs');
var db=redis.createClient();

function User(obj){
    for(var key in obj){
        this[key] = obj[key];
    }
    
}

User.prototype.save = function(fn){
    if(this.id){
        this.update(fn);
    }else{
        var user = this;
        db.incr('user:ids',function(err,id){
            if(err)
                return fn(err);
            user.id = id;
            user.hashPassword(function(err){
                if(err)
                    return fn(err);
                user.update(fn);
            })
            //user.update(fn);
        });
    }
    
};

User.prototype.update = function(fn){
    var user = this;
    var id = user.id;
    db.set('user:id:'+ user.name,id,function(err){
        if(err) 
            return fn(err);
        db.hmset('user:' + id,user,function(err){
           fn(err); 
        });
    });
};

User.prototype.hashPassword = function(fn){
    var user = this;
    bcrypt.genSalt(12,function(err,salt){
        if(err)
            return fn(err);
        bcrypt.hash(user.pass,salt,function(err,hash){
            if(err)
                return fn(err);
            user.pass = hash;
            fn();
        });
    });
};


User.getByName = function(name,fn){
    User.getId(name,function(err,id){
        if(err)
            return fn(err)
        User.get(id,fn);    
    });
};

User.getId = function(name,fn){
    db.get('user:id:' + name, fn);
};

User.get = function(id,fn){
    db.hgetall('user:' + id,function(err,user){
        if(err)
            return fn(err);
        fn(null,new User(user));
    });
};

User.authenticate = function(name,pass,fn){
    User.getByName(name,function(err,user){
       if(err)
           return fn(err);
        if(!user.id) 
            return fn();
        if(bcrypt.compareSync(pass,user.pass));
            
            return fn(null,user);
        fn();
        //if(pass == user.pass)
    });
    
};

module.exports = User;

/*var bharath = new User({
    name: 'Bharath',
    pass: 'anil',
    age: '28'
    
});

var pradeep = new User({
    name: 'Pradeep',
    pass: 'deepu',
    age: '26'
    
});

var arun = new User({
    name: 'Arun',
    pass: 'arun',
    age: '24'
    
});

var rajasekhar = new User({
    name: 'Rajasekhar',
    pass: 'sekhar',
    age: '45'
    
});

var laxmidevi = new User({
    name: 'LakshmiDevi',
    pass: 'tulasi',
    age: '43'
    
});

bharath.save(function(err){
    if(err)
        throw err;
    console.log('user id %d', bharath.id);
});

rajasekhar.save(function(err){
    if(err)
        throw err;
    console.log('user id %d', rajasekhar.id);
});

laxmidevi.save(function(err){
    if(err)
        throw err;
    console.log('user id %d', laxmidevi.id);
});*/
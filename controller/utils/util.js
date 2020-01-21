var util = {};

util.parseError = function(errors){
    var parsed = {};
    if(errors.name == 'ValidationError'){
        for(var name in errors.errors){
            var validationError = errors.errors[name];
            parsed[name] = { message:validationError.message };
        }
    } else if(errors.code == "11000" && errors.errmsg.indexOf("username") > 0) {
        parsed.username = { message:"This username already exists!" };
    } else {
        parsed.unhandled = JSON.stringify(errors);
    }
    return parsed;
}

util.checkStatus = function (res) {
    if (res.ok) { // res.status >= 200 && res.status < 300
        return res;
    } else {
        console.error('error :' + res.statustext);
    }
}

util.isLogin = function(req, res, next) {
    if(req.isAuthenticated()) {
        next();
    } else {
        req.flash("errors", {login: "please login first"});
        res.redirect('logIn');
    }
}

util.noPermission = function(req, res) {
    req.flash('errors', {login: 'you dont have permission'});
    req.logout();
    res.redirect('logIn');
}

module.exports = util;
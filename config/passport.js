var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User          = require("../controller/db/userSchema");

passport.use('local-login',
  new LocalStrategy({
    usernameField     : 'useremail',
    passwordField     : 'password',
    passReqToCallback : true
  },
  function(req, useremail, password, done) {
    User.findOne({useremail:useremail})
    .select({password:1})
    .exec(function(err, user) {
      if(err) return done(err);
      if(user && user.authenticate(password)) {
        return done(null, user);
      } else {
        req.flash('useremail',useremail);
        req.flash('errors',{login:'incorrect username or password'});
        return done(null, false);
      }
    });
  })
);

passport.serializeUser(function(user, done){
  done(null, user.id);
})
passport.deserializeUser(function(id, done){
  User.findOne({_id:id},function(err, user){
    done(err, user);
  });
});

module.exports = passport;

var mongoose  = require('mongoose');
var bcrypt    = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    username  : {
      type      : String,
      required  : [true, "username is required"],
      match     : [/^.{4,12}$/,"Should be 4-12 characters!"],
      trim      : true
    },
    useremail : {
      type      : String,
      required  : [true, "useremail is required"],
      match     : [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/,"Should be a vaild email address!"],
      trim      : true,
      unique    : true
    },
    password  : {
      type      : String,
      required  : [true, "password is required"],
      select    : false
    }
},{
    toObject:{virtuals:true}
});

userSchema.virtual("passwordConfirmation")
.get(function(){ return this._passwordConfirmation; })
.set(function(value){ this._passwordConfirmation=value; });

var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
var passwordRegexErrorMessage = "Should be minimum 8 characters of alphabet and number combination!";

userSchema.path("password").validate(function(v) {
  var user = this;

  if(!user.passwordConfirmation){
    user.invalidate("passwordConfirmation", "Password Confirmation is required!");
  }
  if(!passwordRegex.test(user.password)){
    user.invalidate("password", passwordRegexErrorMessage);
  } else if(user.password !== user.passwordConfirmation) {
    user.invalidate("passwordConfirmation", "Password Confirmation does not matched!");
  }
  if(user.password !== user.passwordConfirmation) {
    user.invalidate("passwordConfirmation", "Password Confirmation does not matched!");
  }
});

userSchema.pre("save", function (next){
  var user = this;
  if(!user.isModified("password")){
    return next();
  } else {
    user.password = bcrypt.hashSync(user.password);
    return next();
  }
});

userSchema.methods.authenticate = function (password) {
  var user = this;
  return bcrypt.compareSync(password,user.password);
};

var User = mongoose.model("user",userSchema);
module.exports = User;

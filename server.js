const express         = require('express');
const db              = require('./db.js');
const logger          = require('./controller/utils/logger');
const bodyParser      = require('body-parser');
const methodOverride  = require("method-override");
const flash           = require('connect-flash');
const session         = require('express-session');
const passport        = require('./config/passport');
const cookieParser    = require('cookie-parser');
const app             = express();
db;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

const server = app.listen(3000, function(){
  logger.info('server has started on port 3000');
});

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(flash());
app.use(cookieParser());
app.use(session({secret:"1234", resave:true, saveUninitialized:false}));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req,res,next){
  res.locals.isAuth     = req.isAuthenticated();
  res.locals.currenUser = req.user;
  next();
})

app.use('/', require('./controller/main'));
app.use('/bitcoin',require('./controller/bitcoin/bitcoin'));
app.use('/ethereum',require('./controller/ethereum/ethereum'));

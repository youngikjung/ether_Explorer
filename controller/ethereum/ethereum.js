var express   = require('express')
var router    = express.Router();
var fetch     = require("node-fetch");
var User      = require("../db/userSchema");
var passport  = require("../../config/passport");
var util      = require('../utils/util');
var logger      = require('../utils/logger');


router.post('/regSignUp', async (req, res) => {
  try {
    await User.create(req.body,(err, user) => {
      if(err){
        req.flash("user", req.body);
        req.flash("errors", util.parseError(err));
        return res.redirect("signUp");
      }
      res.redirect('/ethereum');
    });
  } catch (error) {
    logger.error(error);
    res.end(error);
  }
});

router.post('/logIn',
  (req, res, next) => {
    var errors  = {};
    var isValid = true;

    if(!req.body.useremail) {
      isValid = false;
      errors.useremail = "useremail is required";
    }
    if(!req.body.password) {
      isValid = false;
      errors.password = "password is required";
    }

    if(isValid) {
      next();
    } else {
      req.flash('errors', errors);
      res.redirect('logIn');
    }
  },
  passport.authenticate('local-login', {failureRedirect : 'logIn'})
  ,(req, res) => {
    req.session.save(() => {
      res.locals.isAuth     = req.isAuthenticated(); 
      res.locals.currenUser = req.user;  
      logger.info(res.locals.currenUser + 'login'); 
      res.render('ethereum/index');
    });
  }
);

router.get('/logIn', (req, res) => {
  var useremail = req.flash('useremail')[0];
  var errors    = req.flash('errors')[0] || {};
  res.render('ethereum/logIn', {
    useremail : useremail,
    errors    : errors
  });
});

router.get('/signUp', (req, res) => {
  var user    = req.flash("user")[0] || {};
  var errors  = req.flash("errors")[0] || {};
  res.render("ethereum/signUp", { user:user, errors:errors });
});

router.get('/logout', (req, res) => {
  logger.info(res.locals.currenUser + 'logout');
  req.logout();
  res.redirect('/ethereum');
});

router.get('/viewBlockNumber', (req, res) => {
  logger.info('viewBlockNumber');
  res.render('ethereum/getBlockDB');
});

router.get('/viewTxNumber', (req, res) => {
  logger.info('viewTxNumber');
  res.render('ethereum/getTxDB');
});

router.get('/back', (req, res) => {
  logger.info('back');
  res.redirect('/ethereum');
});

router.get('/backGetBlock', (req, res) => {
  logger.info('backGetBlock');
  res.redirect('ethereum/getBlock');
});

router.get('/goAccount', (req, res) => {
  logger.info('goAccount');
  res.render('ethereum/account');
});

router.get('/', (req, res) => { 
  logger.info('진입');  
  res.render('ethereum/index');
});

router.get('/transactions/:transactionsHash', (req, res) => {
    var transactionsHash = req.params.transactionsHash;
    fetch('http://10.10.30.165:3000/getBlock/' + transactionsHash)
    .then(util.checkStatus)
    .then(res => res.json())
    .then(json => {
      logger.info(transactionsHash + '의 검색');  
      res.render('ethereum/transactions', {block:json.transactions})
    }).catch(err => logger.error(err));
});

router.get('/transactionInfo/:transactionHash', (req, res) => {
    var transactionHash  = req.params.transactionHash;
    fetch('http://10.10.30.165:3000/getTransaction/' + transactionHash)
    .then(util.checkStatus)
    .then(res => res.json())
    .then(json => {
      logger.info(transactionHash + '의 검색');
      res.render('ethereum/info', {block:json})
    }).catch(err => logger.error(err));
});

router.post('/searchBlockNumber', (req, res, next) => {
    var select = req.body.lstSubject;
    var blockNumber = req.body.search;

    if(select === 'address') {
        fetch('http://10.10.30.165:3000/getBalance/' + blockNumber)
        .then(util.checkStatus)
        .then(res => res.json())
        .then(json => {
          logger.info(select + '에서' + blockNumber + '의 검색');
          res.render('ethereum/getBalance', {block:json})
        }).catch(err => logger.error(err));
    }
    if(select === 'block') {
        fetch('http://10.10.30.165:3000/getBlock/' + blockNumber)
        .then(util.checkStatus)
        .then(res => res.json())
        .then(json => {
          logger.info(select + '에서' + blockNumber + '의 검색');
          res.render('ethereum/getBlock', {block:json})
        }).catch(err => logger.error(err));
    }
});

router.post('/getAccount', util.isLogin, (req, res) => {
    var passwd = req.body.passwd;
    fetch('http://10.10.30.165:3000/newAccount/' + passwd)
    .then(util.checkStatus)
    .then(res => res.json())
    .then(json => {
      logger.info(json + '을 불러옵니다');
      res.json(json);
    }).catch(err => logger.error(err));
});

router.get('/getBlockDB', (req, res) => {
  fetch('http://10.10.30.165:3000/getBlockDB')
  .then(util.checkStatus)
  .then(res => res.json())
  .then(json => {
    logger.info(json + '을 불러옵니다');
    res.json(json);
  }).catch(err => logger.error(err));
});

router.get('/getTxDB', (req, res) => {
  fetch('http://10.10.30.165:3000/getTxDB')
  .then(util.checkStatus)
  .then(res => res.json())
  .then(json => {
    logger.info(json + '을 불러옵니다');
    res.json(json);
  }).catch(err => logger.error(err));
});

router.get('/getBlockDBInfo', (req, res) => {
  fetch('http://10.10.30.165:3000/getDBblocksInfo')
  .then(util.checkStatus)
  .then(res => res.json())
  .then(json => {
    logger.info(json + '을 불러옵니다');
    res.json(json);
  }).catch(err => logger.error(err));
});

router.get('/getTxDBInfo', (req, res) => {
  fetch('http://10.10.30.165:3000/getDBtxsInfo')
  .then(util.checkStatus)
  .then(res => res.json())
  .then(json => {
    logger.info(json + '을 불러옵니다');
    res.json(json);
  }).catch(err => logger.error(err));
});

module.exports = router;

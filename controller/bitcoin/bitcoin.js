var express = require('express')
var router  = express.Router();
var fetch   = require("node-fetch");

function checkStatus(res) {
    if (res.ok) { // res.status >= 200 && res.status < 300
        return res;
    } else {
        console.error('error :' + res.statustext);
    }
}

router.get('/', function(req, res){
    res.render('bitcoin/bitcoinHome');
});

router.get('/back', function(req, res) {
    res.redirect('/bitcoin');
});

router.post('/searchBitBlockNumber', function(req, res, next) {
    var select = req.body.lstSubject;
    var blockNumber = req.body.search;
    fetch('http://10.10.50.198:3300/getBlockHash/' + blockNumber)
    .then(checkStatus)
    .then(res => res.json())
    .then(json => {   
        console.log(json);
        res.render('bitcoin/getBlock', {block:json})      
    }).catch(err => console.log(err));
    
});

router.get('/goTransactionsBit/:hash', function(req, res){

    var transactionsHash = req.params.hash;
    fetch('http://10.10.50.198:3300/getBlockTransaction/' + transactionsHash)
    .then(checkStatus)
    .then(res => res.json())
    .then(json => {
        
        res.render('bitcoin/transactions', {block : json});     
    }).catch(err => console.log('err :' + err));
});

module.exports = router;
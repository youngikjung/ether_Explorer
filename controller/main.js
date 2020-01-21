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

// var lastest = function(req, res, next) {
//     fetch('https://ethgasstation.info/json/ethgasAPI.json')
//     .then(checkStatus)
//     .then(res => res.json())
//     .then(json => {
//         res.end(json);
//         next();
//     }).catch(err => console.log('err :' + err));
// }

// var transactionLog = function(req, res, next) {
//     fetch('https://ethgasstation.info/json/predictTable.json')
//     .then(checkStatus)
//     .then(res => res.json())
//     .then(json => { 
//         res.end(json);
//         next();
//     }).catch(err => console.log('err :' + err));
// }


router.get('/ajax', function(req, res) {
    console.log('connected');
    fetch('http://10.10.30.165:3000/newBlockHeaders')
    .then(checkStatus)
    .then(res => res.json())
    .then(json => {
        res.json(json);
    }).catch(err => console.log('err :' + err));
    
});

router.get('/', function(req, res) {
    res.render('home');  
});

router.get('/viewBlockNumber/:transactionsHash', function(req, res){

    var transactionsHash  = req.params.transactionsHash;
    fetch('http://10.10.30.165:3000/getBlock/' + transactionsHash)
    .then(checkStatus)
    .then(res => res.json())
    .then(json => { 
        console.log({block:json});  
        res.render('ethereum/getBlock', {block:json})      
    }).catch(err => console.log(err));
});

module.exports = router;



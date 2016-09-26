var express = require('express');
var router = express.Router();
var path = require("path");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Login' });
});

exports.index = function(req, res){
  res.render('index', { title: "Login"});
};

module.exports = router;
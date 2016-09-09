var express = require('express');
var route = express.Router();
/* GET home page. */
route.get('/', function(req, res, next) {
	res.render('index', { title: 'Programme finder'});
});

module.exports = route;

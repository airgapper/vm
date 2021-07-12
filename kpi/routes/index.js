var express = require('express');
var router = express.Router();

var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {

  fs.readFile('data.json', 'utf8', function(err, data) {
  	try {
  		data = JSON.parse(data);
  	} catch(err) {
  		return res.send("Error", err.toString());
  	}
	res.render('index', {
	  title: 'VirtKick KPI Dashboard TSCloud 2015 - Week ' + data.week,
	  data: data
	});
  });
});

module.exports = router;

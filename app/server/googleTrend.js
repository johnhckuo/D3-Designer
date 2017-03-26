/**
 * New node file
 */
'use strict';

const googleTrends = require('google-trends-api');
var util = require('util');
	function get_trend(req, res){

		console.log("fatching");
		googleTrends.relatedQueries({keyword:  req.body.keyword})
		.then(function(results){
		  console.log("sucess" +  req.body.keyword);
		  res.json(results);
		})
		.catch(function(err){
		  console.error(err);
		});
	}
	
	exports.get_trend = get_trend;
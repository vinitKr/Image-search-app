'use strict';

var ImageSchema = require('./search.model');
var async = require('async');
var Scraper = require ('images-scraper')
  , google = new Scraper.Google();

/**********************************************************************
 * API -> get all search results
 * METHOD -> GET
 * URL -> api/search
 * Response -> {status, result}
 * Authentication : open
 *********************************************************************/

exports.index = function(req, res) {
	var searchKey = req.params.key
	google.list({
		keyword: searchKey,
		num: 15,
		detail: true,
		nightmare: {
			show: false
		}
	})
	.then(function (images) {
		var data = {
			'searchKey': searchKey,
			'images': images
		}

		ImageSchema.create(data, function(err, imageData) {
            if (err) {
            	return res.status(500).send(err);
            } else{
            	return res.status(200).json({
					status: 200,
					result: imageData
				})
            }
        });
	}).catch(function(err) {
		console.log('err', err);
		return res.status(500).send(err);
	});
}

/**********************************************************************
 * API -> get all previous searched keys
 * METHOD -> GET
 * URL -> api/search/keys
 * Response -> {status, result}
 * Authentication : open
 *********************************************************************/

exports.getSearchHistory = function(req, res) {
    ImageSchema.find({}, '-images')
        .exec(function(err, keys) {
            if (err) {
        	return res.status(500).send(err);
        } else{
        	return res.status(200).json({
				status: 200,
				result: keys
			})
        }
    });
}

/**********************************************************************
 * API -> get previous results based on search key
 * METHOD -> GET
 * URL -> api/search/result/:key
 * Response -> {status, result}
 * Authentication : open
 *********************************************************************/

exports.getPrevResult = function(req, res) {
	var searchKey = req.params.key;
    ImageSchema.findOne({ 'searchKey': searchKey }, function(err, data) {
        if (err) {
    		return res.status(500).send(err);
        } else{
        	return res.status(200).json({
				status: 200,
				result: data
			})
        }
    });
}
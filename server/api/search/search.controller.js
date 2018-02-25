'use strict';

var SearchCollection = require('./search.model');
var async = require('async');
var fs = require('fs');
var Jimp = require("jimp");
var Scraper = require('images-scraper')
	, google = new Scraper.Google();



/**********************************************************************
 * API -> get all search results
 * METHOD -> GET
 * URL -> api/search
 * Response -> {status, result}
 * Authentication : open
 *********************************************************************/

exports.index = function (req, res) {
	var searchKey = req.params.key
	SearchCollection.findOne({ 'searchKey': searchKey }, function (err, data) {
		if (err) {
			return res.status(500).send(err);
		}
		console.log('ddd>>>>', data);
		if (data) {
			return res.status(200).json({
				status: 200,
				result: data
			})
		}
		google.list({
			keyword: searchKey,
			num: 15,
			detail: true,
			nightmare: {
				show: false
			}
		})
			.then(function (images) {

				async.forEachOf(images, function (bData, index, CB) {
					if (bData) {

						var url = bData.thumb_url;	// image url
						var validExtensions = ['jpg', 'png', 'jpeg', 'bmp'];
						var ext = bData.type.split('/').pop();

						// validate image extension.
						if (validExtensions.indexOf(ext) < 0) {
							console.log('Fetching ' + url + ' failed. Invalid Extension!');
							return CB();
						}

						// download image from remote url
						Jimp.read(url, function (err, image) {
							if (!err) {

								var basePath = process.cwd() + "/client/images";
								var parentDirectory = searchKey.trim().toLowerCase().replace(/\s+/g, '-')
								var fullPath = basePath + '/' + parentDirectory;

								// check if destination path exist.
								if (!fs.existsSync(basePath)) {
									fs.mkdirSync(basePath);
								}
								if (!fs.existsSync(fullPath)) {
									fs.mkdirSync(fullPath);
								}

								var imageName = searchKey + '_' + index;
								var filename = fullPath + '/' + imageName;

								image.quality(60)	// set JPEG quality 
									.greyscale()	// set greyscale 
									.write(filename + '.' + ext);	// save image

								// save local path of image in db
								bData['localPath'] = "/images/" + searchKey + '/' + imageName + '.' + ext;
							}
							CB()
						});

					} else {
						CB()
					}
				}, function () {
					var data = {
						'searchKey': searchKey,
						'images': images
					};

					// save data to db
					SearchCollection.create(data, function (err, imageData) {
						if (err) {
							return res.status(500).send(err);
						} else {
							return res.status(200).json({
								status: 200,
								result: imageData
							})
						}
					});
				});
			}).catch(function (err) {
				console.log('err', err);
				return res.status(500).send(err);
			});
	});
}

/**********************************************************************
 * API -> get all previous searched keys
 * METHOD -> GET
 * URL -> api/search/keys
 * Response -> {status, result}
 * Authentication : open
 *********************************************************************/

exports.getSearchHistory = function (req, res) {
	SearchCollection.find({}, '-images')
		.exec(function (err, keys) {
			if (err) {
				return res.status(500).send(err);
			} else {
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

exports.getPrevResult = function (req, res) {
	var searchKey = req.params.key;
	SearchCollection.findOne({ 'searchKey': searchKey }, function (err, data) {
		if (err) {
			return res.status(500).send(err);
		} else {
			return res.status(200).json({
				status: 200,
				result: data
			})
		}
	});
}
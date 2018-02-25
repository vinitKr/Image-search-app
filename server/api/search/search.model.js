'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var SearchCollection = new Schema({
  	
  	searchKey: String,
	images: []

}, { timestamps: true });

module.exports = mongoose.model('SearchCollection', SearchCollection);
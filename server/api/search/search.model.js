'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ImageSchema = new Schema({
  	
  	searchKey: String,
	images: []

}, { timestamps: true });

module.exports = mongoose.model('ImageSchema', ImageSchema);
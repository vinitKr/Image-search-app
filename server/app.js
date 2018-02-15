/**
 * Main application file
 */

'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';



var express = require('express');
var cors = require('cors');
var mongoose = require('mongoose');
var config = require('./config');

// Connect to database
mongoose.connect(config.mongo.uri);
mongoose.connection.on('error', function(err) {
		console.error('MongoDB connection error: ' + err);
		process.exit(-1);
	}
);

// Setup server
var app = express();
app.use(cors());
var server = require('http').createServer(app);

require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
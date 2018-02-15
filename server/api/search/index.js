'use strict';

var express = require('express');
var controller = require('./search.controller');

var router = express.Router();

router.get('/keys', controller.getSearchHistory);
router.get('/result/:key', controller.getPrevResult);
router.get('/:key', controller.index);

module.exports = router;
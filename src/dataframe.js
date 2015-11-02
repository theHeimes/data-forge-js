'use strict';

//
// Implements a data frame data structure.
//

var BaseDataFrame = require('./basedataframe');

var assert = require('chai').assert;
var E = require('linq');
var fs = require('fs');
var inherit = require('./inherit');

var DataFrame = function (columnNames, values) {
	assert.isArray(columnNames, "Expected 'columnNames' parameter to DataFrame constructor to be an array.");
	assert.isArray(values, "Expected 'values' parameter to DataFrame constructor to be an array.");
	
	var self = this;
	self._columnNames = columnNames;
	self._values = values;
};

var parent = inherit(DataFrame, BaseDataFrame);

DataFrame.prototype.columns = function () {
	var self = this;
	return self._columnNames;
};

DataFrame.prototype.values = function () {
	var self = this;
	return self._values;
};

//
// For compatability with LazyDataFrame. A DataFrame is already baked, so just return self. 
//
DataFrame.prototype.bake = function () {
	var self = this;
	return self;
};

module.exports = DataFrame;
'use strict';

//
// Implements input/output for the CSV format.
//

var panjas = require('../index');

var fs = require('fs');
var assert = require('chai').assert;
var Q = require('q');

module.exports = function (filePath) {
	assert.isString(filePath, "Expected 'filePath' parameter to 'file data source' to be a string.");

	return {

		//
		// Write to a text file.
		//	
		read: function () {
			
			return Q.Promise(function (resolve, reject) {
				fs.readFile(filePath, 'utf-8', function (err, fileData) {
					if (err) {
						reject(err);
						return;
					}
					
					resolve(fileData);
				});		
			});
		},
		
		//
		// Read from a text file.
		//
		write: function (fileData) {
			assert.isString(fileData, "Expected 'fileData' parameter to 'file.write' to be a string.");
			
			return Q.Promise(function (resolve, reject) {
				fs.writeFile(filePath, fileData, function (err) {
					if (err) {
						reject(err);
					}
					else {
						resolve();
					}
				});					
			});		
		},
	};
};
	
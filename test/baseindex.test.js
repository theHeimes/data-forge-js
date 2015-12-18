'use strict';

describe('Index', function () {

	var BaseIndex = require('../src/baseindex');
	var ArrayEnumerator = require('../src/enumerators/array');

	var expect = require('chai').expect;
	var assert = require('chai').assert;

	var initIndex = function (values) {
		assert.isArray(values);

		var baseIndex = new BaseIndex();
		
		baseIndex.getName = function () {
			return '==test-index==';
		};

		baseIndex.getEnumerator = function () {
			return new ArrayEnumerator(values);
		};
		
		return baseIndex;
	};

	it('can get values from index', function () {

		var index = initIndex([0, 1, 2, 3]);
		expect(index.toValues()).to.eql([0, 1, 2, 3]);
	});

	it('can skip', function () {

		var index = initIndex([0, 1, 2, 3]);
		expect(index.skip(2).toValues()).to.eql([2, 3]);
	});

	it('can take', function () {

		var index = initIndex([0, 1, 2, 3]);
		expect(index.take(2).toValues()).to.eql([0, 1]);
	});

	it('can get subset of rows', function () {

		var index = initIndex([0, 1, 2, 3]);
		var subset = index .getRowsSubset(1, 2);
		expect(subset.toValues()).to.eql([1, 2]);
	});
});
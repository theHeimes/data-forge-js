'use strict';


describe('BaseDataFrame', function () {
	
	var panjas = require('../index');	
	var BaseDataFrame = require('../src/basedataframe');
	
	var expect = require('chai').expect;
	var assert = require('chai').assert;
	
	var initExampleDataFrame = function () {
		var dataFrame = new BaseDataFrame();
		dataFrame.getColumnNames = function () {
			return [
				"Date",
				"Value1",
				"Value2",
				"Value3",
			]; 
		};
		dataFrame.getValues = function () {
			return [
				[new Date(1975, 24, 2), 100, 'foo', 11],
				[new Date(2015, 24, 2), 200, 'bar', 22],
			];
		};
		return dataFrame;
	}; 

	var initExampleDataFrame2 = function () {
		var dataFrame = new BaseDataFrame();
		dataFrame.getColumnNames = function () {
			return [
				"Date",
				"Value1",
				"Value2",
				"Value3",
			]; 
		};
		dataFrame.getValues = function () {
			return [
				[new Date(2011, 24, 2), 300, 'c', 3],
				[new Date(1975, 24, 2), 200, 'b', 1],
				[new Date(2013, 24, 2), 20, 'c', 22],
				[new Date(2015, 24, 2), 100, 'd', 4],
			];
		};
		return dataFrame;
	}; 
	
	it('throws expection when pulling a non-existing column name', function () {
		
		expect(function () {
			var dataFrame = initExampleDataFrame();
			dataFrame.getColumn('non-existing column name');			
		}).to.throw(Error).with.property('message').that.equals("In call to 'getColumn' failed to find column 'non-existing column name'.");
	});

	it('can retreive column by name', function () {
		
		var dataFrame = initExampleDataFrame();
		var column1 = dataFrame.getColumn('Value1');
		expect(column1.getValues()).to.eql([
			100,
			200,
		]);		
		
		var column2 = dataFrame.getColumn('Value2');
		expect(column2.getValues()).to.eql([
			'foo',
			'bar',
		]);			
		
		var column3 = dataFrame.getColumn('Value3');
		expect(column3.getValues()).to.eql([
			11,
			22,
		]);		
	});

	it('can retreive column by index', function () {
		
		var dataFrame = initExampleDataFrame();
		var column1 = dataFrame.getColumn(1);
		expect(column1.getValues()).to.eql([
			100,
			200,
		]);		
		
		var column2 = dataFrame.getColumn(2);
		expect(column2.getValues()).to.eql([
			'foo',
			'bar',
		]);			
		
		var column3 = dataFrame.getColumn(3);
		expect(column3.getValues()).to.eql([
			11,
			22,
		]);		
	});

	it('can retreive columns', function () {
		
		var dataFrame = initExampleDataFrame();
		var columns = dataFrame.getColumns();
		expect(columns.length).to.eql(4);

		expect(columns[0].getName()).to.eql('Date');
		expect(columns[0].getValues()).to.eql([new Date(1975, 24, 2), new Date(2015, 24, 2)]);

		expect(columns[2].getName()).to.eql('Value2');
		expect(columns[2].getValues()).to.eql(['foo', 'bar']);
	});
	
	it('can retreive column subset as new dataframe', function () 
	{
		var dataFrame = initExampleDataFrame();
		var subsetDataFrame = dataFrame.getColumnsSubset(['Value3', 'Value1']);
		expect(dataFrame).not.to.equal(subsetDataFrame); 
		expect(subsetDataFrame.getValues()).to.eql(			[
			[11, 100],
			[22, 200],
		]);
	});
	
	it('can output data frame', function () {
		
		var dataFrame = initExampleDataFrame();
		var dataSourceOptions = {};
		var formatOptions = {};
		var formattedText = "some-text";
		var promise = {};

		var dataFormatPlugin = {
			to: function (outputDataFrame, options) {
				expect(outputDataFrame).to.equal(dataFrame);
				expect(options).to.equal(formatOptions);
				return formattedText;				
			},
		};
		
		var dataSourcePlugin = {
			write: function (textData, options) {
				expect(textData).to.equal(formattedText);
				expect(options).to.equal(dataSourceOptions);
				return promise;				
			},
		};
		
		var result = dataFrame
			.as(dataFormatPlugin, formatOptions)
			.to(dataSourcePlugin, dataSourceOptions);
		expect(result).to.equal(promise);
	});
	
	it('can sort by single column ascending', function () {
		
		var dataFrame = initExampleDataFrame2();
		var sorted = dataFrame.orderBy('Value1');
		expect(sorted.getValues()).to.eql([
			[new Date(2013, 24, 2), 20, 'c', 22],
			[new Date(2015, 24, 2), 100, 'd', 4],
			[new Date(1975, 24, 2), 200, 'b', 1],
			[new Date(2011, 24, 2), 300, 'c', 3],
		]);
	});
	
	it('can sort by multiple columns ascending', function () {
		
		var dataFrame = initExampleDataFrame2();
		var sorted = dataFrame.orderBy('Value2').thenBy('Value1');
		expect(sorted.getValues()).to.eql([
			[new Date(1975, 24, 2), 200, 'b', 1],
			[new Date(2013, 24, 2), 20, 'c', 22],
			[new Date(2011, 24, 2), 300, 'c', 3],
			[new Date(2015, 24, 2), 100, 'd', 4],
		]);
	});

	it('can sort by 3 columns ascending', function () {
		
		var dataFrame = initExampleDataFrame2();
		var sorted = dataFrame.orderBy('Value2').thenBy('Value1').thenBy('Value3');
		expect(sorted.getValues()).to.eql([
			[new Date(1975, 24, 2), 200, 'b', 1],
			[new Date(2013, 24, 2), 20, 'c', 22],
			[new Date(2011, 24, 2), 300, 'c', 3],
			[new Date(2015, 24, 2), 100, 'd', 4],
		]);
	});

	it('can sort by single column descending', function () {
		
		var dataFrame = initExampleDataFrame2();
		var sorted = dataFrame.orderByDescending('Value3');
		expect(sorted.getValues()).to.eql([
			[new Date(2013, 24, 2), 20, 'c', 22],
			[new Date(2015, 24, 2), 100, 'd', 4],
			[new Date(2011, 24, 2), 300, 'c', 3],
			[new Date(1975, 24, 2), 200, 'b', 1],
		]);
	});

	it('can sort by multiple column descending', function () {
		
		var dataFrame = initExampleDataFrame2();
		var sorted = dataFrame.orderByDescending('Value2').thenByDescending('Value3');
		expect(sorted.getValues()).to.eql([
			[new Date(2015, 24, 2), 100, 'd', 4],
			[new Date(2013, 24, 2), 20, 'c', 22],
			[new Date(2011, 24, 2), 300, 'c', 3],
			[new Date(1975, 24, 2), 200, 'b', 1],
		]);
	});

	it('can sort by 3 columns descending', function () {
		
		var dataFrame = initExampleDataFrame2();
		var sorted = dataFrame.orderByDescending('Value2').thenByDescending('Value3').thenByDescending('Value1');
		expect(sorted.getValues()).to.eql([
			[new Date(2015, 24, 2), 100, 'd', 4],
			[new Date(2013, 24, 2), 20, 'c', 22],
			[new Date(2011, 24, 2), 300, 'c', 3],
			[new Date(1975, 24, 2), 200, 'b', 1],
		]);
	});

	it('can drop column', function () {
		
		var dataFrame = initExampleDataFrame2();
		var modified = dataFrame.dropColumn('Date');
		expect(modified.getValues()).to.eql([
			[300, 'c', 3],
			[200, 'b', 1],
			[20, 'c', 22],
			[100, 'd', 4],
		]);
	});

	it('can drop multiple columns', function () {
		
		var dataFrame = initExampleDataFrame2();
		var modified = dataFrame.dropColumn(['Date', 'Value2'])
		expect(modified.getValues()).to.eql([
			[300, 3],
			[200, 1],
			[20, 22],
			[100, 4],
		]);
	});

	it('can add column', function () {
		
		var dataFrame = initExampleDataFrame2();
		var modified = dataFrame.setColumn('Value4', [1, 2, 3, 4]);
		expect(modified.getColumnNames()).to.eql([
			"Date",
			"Value1",
			"Value2",
			"Value3",
			"Value4",
		]);
		expect(modified.getValues()).to.eql([
			[new Date(2011, 24, 2), 300, 'c', 3, 1],
			[new Date(1975, 24, 2), 200, 'b', 1, 2],
			[new Date(2013, 24, 2), 20, 'c', 22, 3],
			[new Date(2015, 24, 2), 100, 'd', 4, 4],
		]);
	});

	it('can overwrite column', function () {
		
		var dataFrame = initExampleDataFrame2();
		var modified = dataFrame.setColumn('Value1', [1, 2, 3, 4]);
		expect(modified.getValues()).to.eql([
			[new Date(2011, 24, 2), 1, 'c', 3],
			[new Date(1975, 24, 2), 2, 'b', 1],
			[new Date(2013, 24, 2), 3, 'c', 22],
			[new Date(2015, 24, 2), 4, 'd', 4],		
		]);
	});

	it('can add column from other data frame', function () {
		
		var dataFrame1 = initExampleDataFrame();
		var dataFrame2 = initExampleDataFrame2();
		var modified = dataFrame2.setColumn('Value4', dataFrame1.getColumn('Value2'));
		expect(modified.getColumnNames()).to.eql([
			"Date",
			"Value1",
			"Value2",
			"Value3",
			"Value4",
		]);
		expect(modified.getValues()).to.eql([
			[new Date(2011, 24, 2), 300, 'c', 3, 'foo'],
			[new Date(1975, 24, 2), 200, 'b', 1, 'bar'],
			[new Date(2013, 24, 2), 20, 'c', 22, undefined],
			[new Date(2015, 24, 2), 100, 'd', 4, undefined],
		]);
	});

	it('can get slice of rows', function () {

		var dataFrame = initExampleDataFrame2();
		var subset = dataFrame.getRowsSubset(1, 2);
		expect(subset.getValues()).to.eql([
			[new Date(1975, 24, 2), 200, 'b', 1],
			[new Date(2013, 24, 2), 20, 'c', 22],
		]);
	});
});

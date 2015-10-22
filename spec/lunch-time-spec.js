var moment = require('moment-timezone');

describe('lunch-time specs', function() {
	beforeEach(function() {
	    this.lunchTime = require('../lib/lunch-time');
		jasmine.clock().install();
	});

	afterEach(function() {
	    jasmine.clock().uninstall();
		this.lunchTime.reset();
	});

    describe('#setNextLunchTime', function() {
		it('sets lunch time to 11:45', function() {
			var mockedDate = new Date(2015, 9, 18, 9, 27, 67);
			jasmine.clock().mockDate(mockedDate);
			this.lunchTime.setNextLunchTime();
			var lunchTime = this.lunchTime.get();
			expect(lunchTime.format('YYYY-MM-DD HH:mm')).toEqual('2015-10-18 11:45');
		});

		it('sets the correct timezone', function () {
			this.lunchTime.setNextLunchTime();
			var lunchTime = this.lunchTime.get();
			console.log(lunchTime.format('YYYY-MM-DD HH:mm'));
			expect(lunchTime.tz()).toEqual('Europe/Berlin');
		});

		it('sets the next day if it is already past 4pm', function () {
			var mockedDate = new Date(2015, 9, 18, 16, 27, 67);
			jasmine.clock().mockDate(mockedDate);
			this.lunchTime.setNextLunchTime();
			var lunchTime = this.lunchTime.get();
			expect(lunchTime.format('YYYY-MM-DD HH:mm')).toEqual('2015-10-19 11:45');
		});
    });

	describe('#get', function() {
	    it('is null by default', function() {
	        expect(this.lunchTime.get()).toBeNull();
	    });
	});

	describe('#setNextLunchTimeIfNull', function () {
		it('sets the next lunch time', function () {
			var mockedDate = new Date(2015, 9, 18, 9, 27, 67);
			jasmine.clock().mockDate(mockedDate);
			this.lunchTime.setNextLunchTimeIfNull();
			var lunchTime = this.lunchTime.get();
			expect(lunchTime.format('YYYY-MM-DD HH:mm')).toEqual('2015-10-18 11:45');
		});

		it('does not set next lunch time if already set', function () {
			var mockedDate = new Date(2015, 9, 22, 9, 27, 67);
			jasmine.clock().mockDate(mockedDate);

			this.lunchTime.setNextLunchTimeIfNull();
			mockedDate = new Date(2015, 9, 18, 9, 27, 67);
			jasmine.clock().mockDate(mockedDate);
			this.lunchTime.setNextLunchTimeIfNull();
			var lunchTime = this.lunchTime.get();
			expect(lunchTime.format('YYYY-MM-DD HH:mm')).toEqual('2015-10-22 11:45');
		});
	});
});
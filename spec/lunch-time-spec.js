var moment = require('moment-timezone');

describe('lunch-time specs', function() {
	beforeEach(function() {
	    this.lunchTime = require('../lib/lunch-time');
		jasmine.clock().install();
	});

	afterEach(function() {
	    jasmine.clock().uninstall();
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
    });
});
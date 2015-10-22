var moment = require('moment-timezone');

var lunchTime = null;

var setNextLunchTime = function () {
	lunchTime = moment();
	lunchTime.tz('Europe/Berlin');
	lunchTime.set({
		hour: 11,
		minute: 45,
		second: 0,
		millisecond: 0
	});

	// If it's already past 4pm, set lunch time for the next day
	if (moment().hour() > 16) {
		lunchTime.add(1, 'day');
	}
};

var checkAndResetTimeIfNecessary = function () {
	if (lunchTime == null) {
		setNextLunchTime();
		return;
	}

	var now = moment();
	var lastLunch = now.diff(lunchTime, 'hours');
	// Reset everything if last lunch time is already more than 2 hours ago
	if (lastLunch >= 2) {
		resetEverything();
	}
};

module.exports = {
	setNextLunchTime: setNextLunchTime,
	checkAndResetTimeIfNecessary: checkAndResetTimeIfNecessary,
	get: function () {
		return lunchTime;
	}
};
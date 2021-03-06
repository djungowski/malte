var moment = require('moment-timezone');

var lunchTime = null;

var setNextLunchTimeIfNull = function () {
	if (lunchTime == null) {
		setNextLunchTime();
	}
};

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
	if (moment().hour() >= 16) {
		lunchTime.add(1, 'day');
	}
};

var isResetNecessary = function () {
	var now = moment();
	var lastLunch = now.diff(lunchTime, 'hours');
	// Reset everything if last lunch time is already more than 2 hours ago
	return (lastLunch >= 2);
};

module.exports = {
	reset: function () {
		lunchTime = null;
	},
	setNextLunchTime: setNextLunchTime,
	setNextLunchTimeIfNull: setNextLunchTimeIfNull,
	isResetNecessary: isResetNecessary,
	get: function () {
		return lunchTime;
	},
	set: function (time) {
		lunchTime = moment(time);
	}
};
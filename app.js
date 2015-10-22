var websocket = require('websocket').server;
var http = require('http');
var express = require('express');
var _ = require('lodash');
var moment = require('moment-timezone');

var port = process.env.PORT || 8080;
var attendees = [];
var lunchTime = null;

app = express();
app.use('/', express.static(__dirname + '/public'));

server = http.createServer(app);

var websocketServer = new websocket({
	httpServer: server,
	autoAcceptConnections: false
});

var resetEverything = function () {
	setNextLunchTime();
	attendees = [];
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
	if (lunchTime.hour() > 16) {
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

websocketServer.on('request', function (request) {
	console.log('New connection opened');
	var connection = request.accept();

	connection.on('close', function () {
		console.log('Connection closed');
	});

	connection.on('message', function (data) {
		var message = JSON.parse(data.utf8Data);

		if (message.time === null) {
			checkAndResetTimeIfNecessary();
		} else {
			lunchTime = moment(message.time);
		}

		if (message.audio !== null) {
			attendees.push(message.name);
			attendees = _.uniq(attendees);
		}
		var broadcastData = {
			name: message.name,
			time: lunchTime,
			audio: message.audio,
			attendees: attendees
		};
		websocketServer.broadcastUTF(JSON.stringify(broadcastData));
	});
});

server.listen(port, function () {
	console.log('Server up and running');
});
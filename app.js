var websocket = require('websocket').server;
var http = require('http');
var express = require('express');
var _ = require('lodash');
var moment = require('moment-timezone');

var port = process.env.PORT || 8080;
var attendees = [];
var lunchTime = require('./lib/lunch-time');

var appConfig = require('./package.json');

app = express();
app.use('/', express.static(__dirname + '/public'));

server = http.createServer(app);

var websocketServer = new websocket({
	httpServer: server,
	autoAcceptConnections: false
});

var resetEverything = function () {
	lunchTime.setNextLunchTime();
	attendees = [];
};

var checkAndResetTimeIfNecessary = function () {
	lunchTime.setNextLunchTimeIfNull();
	if (lunchTime.isResetNecessary()) {
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

		switch (message.type) {
			case 'version':
				var versionData = {
					type: message.type,
					version: appConfig.version
				};
				connection.sendUTF(JSON.stringify(versionData));
				break;

			case 'hunger':
			default:
				if (message.time === null) {
					checkAndResetTimeIfNecessary();
				} else {
					lunchTime.set(message.time);
				}

				if (message.audio !== null) {
					attendees.push(message.name);
					attendees = _.uniq(attendees);
				}
				var broadcastData = {
					type: message.type,
					name: message.name,
					time: lunchTime.get(),
					audio: message.audio,
					attendees: attendees
				};
				websocketServer.broadcastUTF(JSON.stringify(broadcastData));
				break;
		}

	});
});

server.listen(port, function () {
	console.log('Server up and running');
});
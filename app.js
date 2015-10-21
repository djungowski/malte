var websocket = require('websocket').server;
var http = require('http');
var express = require('express');
var _ = require('lodash');

var port = process.env.PORT || 8080;
var attendees = [];

app = express();
app.use('/', express.static(__dirname + '/public'));

server = http.createServer(app);

var websocketServer = new websocket({
	httpServer: server,
	autoAcceptConnections: false
});

websocketServer.on('request', function (request) {
	console.log('New connection opened');
	var connection = request.accept();

	connection.on('close', function () {
		console.log('Connection closed');
	});

	connection.on('message', function (data) {
		var message = JSON.parse(data.utf8Data);
		attendees.push(message.name);
		attendees = _.uniq(attendees);

		var broadcastData = {
			name: message.name,
			time: message.time,
			audio: message.audio,
			attendees: attendees
		};
		websocketServer.broadcastUTF(JSON.stringify(broadcastData));
	});
});

server.listen(port, function () {
	console.log('Server up and running');
});
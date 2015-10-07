var websocket = require('websocket').server;
var http = require('http');
var express = require('express');
var port = process.env.PORT || 8080;

app = express();
app.use('/', express.static(__dirname + '/public'));

server = http.createServer(app);

var websocketServer = new websocket({
  httpServer: server,
  autoAcceptConnections: false
});

websocketServer.on('request', function(request) {
  console.log('New connection opened');
  var connection = request.accept();

  connection.on('close', function () {
    console.log('Connection closed');
  });

  connection.on('message', function(data) {
    websocketServer.broadcastUTF(data.utf8Data);
  });
});

server.listen(port, function() {
  console.log('Server up and running');
});
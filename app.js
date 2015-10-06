var websocket = require('websocket').server;
var http = require('http');
var express = require('express');

app = express();
app.use(express.static(__dirname + '/public'));

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
    var time = data.utf8Data;
    websocketServer.broadcastUTF(time);
  });
});

server.listen(8080, function() {
  console.log('Server up and running');
});
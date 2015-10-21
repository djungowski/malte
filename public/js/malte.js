$(window).load(function() {
  var socket;
  var overlay = $('#overlay');
  var loading = $('#loading');
  var isHungry = $('#is-hungry');
  var isHungryName = $('#is-hungry-name');
  var host = location.origin.replace(/^http/, 'ws');

  var hideOverlay = function() {
    overlay.hide();
  };

  var showOverlay = function() {
    overlay.show();
  };

  var personIsHungry = function (name) {
    isHungry.show();
    isHungryName.text(name);
  };

  var connected = function() {
	  socket.onclose = reconnect;
	  socket.onmessage = receiveAndPlayMessage;

	  hideOverlay();
  };

  var reconnect = function() {
    isHungry.hide();
    socket.close();
    showOverlay();
    // Only try to reconnect every second
    window.setTimeout(function() {
      connect();
    }, 10000);
  };

  var receiveAndPlayMessage = function(message) {
    var transferData = JSON.parse(message.data);
    var time = transferData.time;
    var soundElement = $('#audio-eat-' + time)[0];
    soundElement.pause();
    soundElement.currentTime = 0;
    soundElement.play();
    personIsHungry(transferData.name);
  };

  var connect = function () {
    socket = new WebSocket(host);
    socket.onopen = connected;
    socket.onerror = reconnect;
  };


  connect();
  $('.eat').click(function() {
    var time = $(this).attr('data-time');
    var transferData = {
      time: time,
      name: localStorage.name
    };
    socket.send(JSON.stringify(transferData));
  });
});
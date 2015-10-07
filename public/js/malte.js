$(window).load(function() {
  var socket;
  var overlay = $('#overlay');
  var host = location.origin.replace(/^http/, 'ws');
  var connecting = false;

  var hideOverlay = function() {
    overlay.hide();
  };

  var showOverlay = function() {
    overlay.show();
  };

  var connected = function() {
    hideOverlay();
    connecting = false;
  }

  var reconnect = function() {
    if (connecting) {
      return;
    }
    connecting = false;
    showOverlay();
    // Only try to reconnect every second
    window.setTimeout(function() {
      connect();
    }, 1000);
  };

  var playMessage = function(message) {
    var time = message.data;
    var soundElement = $('#audio-eat-' + time)[0];
    soundElement.pause();
    soundElement.currentTime = 0;
    soundElement.play();
  };

  var connect = function () {
    connecting = true;
    socket = new WebSocket(host);
    socket.onopen = connected;
    socket.onclose = reconnect;
    socket.onerror = reconnect;
    socket.onmessage = playMessage;
  };


  connect();
  $('.eat').click(function() {
    var time = $(this).attr('data-time');
    socket.send(time);
  });

});
$(window).load(function() {
  var socket;
  var overlay = $('#overlay');
  var loading = $('#loading');
  var nameEntry = $('#name-entry');
  var nameEntryTextfield = nameEntry.find('input[type=text]');
  var host = location.origin.replace(/^http/, 'ws');
  var connecting = false;

  var hideLoading = function() {
    loading.hide();
  };

  var hideOverlay = function() {
    overlay.hide();
  };

  var showOverlay = function() {
    overlay.show();
  };

  var showNameTextfield = function() {
    nameEntry.show();
    nameEntryTextfield.focus();
  };

  var connected = function() {
    if (localStorage.name != undefined) {
      hideOverlay();
    } else {
      hideLoading();
      showNameTextfield();
    }
    connecting = false;
  };

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

  nameEntry.on('submit', function(event) {
    event.preventDefault();
    localStorage.name = nameEntryTextfield.val();
    connected();
  });
});
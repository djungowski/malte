$(window).load(function() {
  var socket;
  var overlay = $('#overlay');
  var loading = $('#loading');
  var nameEntry = $('#name-entry');
  var nameEntryTextfield = nameEntry.find('input[type=text]');
  var host = location.origin.replace(/^http/, 'ws');

  var hideLoading = function() {
    loading.hide();
  };

  var showLoading = function() {
    loading.show();
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

  var hideNameTextfield = function() {
    nameEntry.hide();
  };

  var connected = function() {
    if (localStorage.name != undefined) {
      socket.onclose = reconnect;
      socket.onmessage = playMessage;

      hideOverlay();
    } else {
      hideLoading();
      showNameTextfield();
    }
  };

  var reconnect = function() {
    socket.close();
    showOverlay();
    // Only try to reconnect every second
    window.setTimeout(function() {
      connect();
    }, 10000);
  };

  var playMessage = function(message) {
    var time = message.data;
    var soundElement = $('#audio-eat-' + time)[0];
    soundElement.pause();
    soundElement.currentTime = 0;
    soundElement.play();
  };

  var connect = function () {
    socket = new WebSocket(host);
    socket.onopen = connected;
    socket.onerror = reconnect;
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
    hideNameTextfield();
    showLoading();
  });
});
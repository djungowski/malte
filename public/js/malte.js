$(window).load(function() {
  var host = location.origin.replace(/^http/, 'ws');
  var socket = new WebSocket(host);
  $('.eat').click(function() {
    var time = $(this).attr('data-time');
    socket.send(time);
  });

  socket.onmessage = function(message) {
    var time = message.data;
    var soundElement = $('#audio-eat-' + time)[0];
    soundElement.pause();
    soundElement.currentTime = 0;
    soundElement.play();
  };
});
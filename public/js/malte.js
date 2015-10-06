$(window).load(function() {
  var socket = new WebSocket('ws://127.0.0.1:8080');
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
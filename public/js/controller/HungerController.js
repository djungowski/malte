VirtualMalte.HungerController = function ($scope, $http) {
	$scope.attendees = [];

	var noon = new Date();
	noon.setHours(12);
	noon.setMinutes(0);
	noon.setSeconds(0);
	noon.setMilliseconds(0);
	$scope.time = noon;

	var socket;
	var overlay = $('#overlay');
	var host = location.origin.replace(/^http/, 'ws');

	var hideOverlay = function() {
		overlay.hide();
	};

	var showOverlay = function() {
		overlay.show();
	};

	var connected = function() {
		socket.onclose = reconnect;
		socket.onmessage = receiveAndPlayMessage;

		hideOverlay();
	};

	var reconnect = function() {
		socket.close();
		showOverlay();
		// Only try to reconnect every second
		window.setTimeout(function() {
			connect();
		}, 10000);
	};

	var receiveAndPlayMessage = function(message) {
		var transferData = JSON.parse(message.data);
		var audio = transferData.audio;
		var soundElement = $('#audio-eat-' + audio)[0];
		soundElement.pause();
		soundElement.currentTime = 0;
		soundElement.play();
		$scope.attendees = transferData.attendees;
		$scope.time = new Date(transferData.time);
		$scope.$apply();
	};

	var connect = function () {
		socket = new WebSocket(host);
		socket.onopen = connected;
		socket.onerror = reconnect;
	};


	connect();

	$scope.sendFoodRequest = function(audio) {
		var time = $scope.time;
		var transferData = {
			audio: audio,
			time: time,
			name: localStorage.name
		};
		socket.send(JSON.stringify(transferData));
	};
};
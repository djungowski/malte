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
		getBasicInformation();

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
		var time = transferData.time;
		if (audio !== null) {
			var soundElement = $('#audio-eat-' + audio)[0];
			soundElement.pause();
			soundElement.currentTime = 0;
			soundElement.play();
		}
		if (time !== null) {
			$scope.time = new Date(time);
		}
		$scope.attendees = transferData.attendees;
		$scope.$apply();
	};

	var connect = function () {
		socket = new WebSocket(host);
		socket.onopen = connected;
		socket.onerror = reconnect;
	};


	connect();

	var getBasicInformation = function() {
		var transferData = {
			audio: null,
			time: null,
			name: localStorage.name
		};
		sendSocketMessage(transferData);
	};

	$scope.sendFoodRequest = function($event) {
		clickedElement = $($event.currentTarget);
		// Do nothing if the element is disabled
		if (clickedElement.hasClass('button-disabled')) {
			return;
		}
		var audio = clickedElement.attr('data-audio');
		var time = $scope.time;
		var transferData = {
			audio: audio,
			time: time,
			name: localStorage.name
		};
		sendSocketMessage(transferData);
	};

	var sendSocketMessage = function (transferData) {
		socket.send(JSON.stringify(transferData));
	};

	$scope.noAttendees = function () {
		return $scope.attendees.length == 0;
	};
};
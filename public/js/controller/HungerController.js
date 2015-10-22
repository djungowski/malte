VirtualMalte.HungerController = function ($scope, $window) {
	$scope.attendees = [];
	$scope.time = null;

	var socket;
	var overlay = $('#overlay');
	var host = location.origin.replace(/^http/, 'ws');
	var appVersion = null;

	var hideOverlay = function() {
		overlay.hide();
	};

	var showOverlay = function() {
		overlay.show();
	};

	var connected = function() {
		socket.onclose = reconnect;
		socket.onmessage = receiveAndPlayMessage;
		checkVersion();
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

		if (transferData.type == 'version') {
			var serverVersion = transferData.version;
			if (appVersion == null) {
				appVersion = serverVersion;
				return;
			}

			if (appVersion !== serverVersion) {
				$window.location.reload();
			}

			return;
		}

		var audio = transferData.audio;
		var time = transferData.time;

		if (time !== null) {
			$scope.time = new Date(time);
		}

		if (audio !== null) {

			sendLunchNotifaction(audio, transferData.name);
			var soundElement = $('#audio-eat-' + audio)[0];
			soundElement.pause();
			soundElement.currentTime = 0;
			soundElement.play();
		}

		$scope.attendees = transferData.attendees;
		$scope.$apply();
	};

	var sendLunchNotifaction = function (audio, name) {
		var ttl = moment($scope.time).format('HH:mm');
		if (audio == 'plus1') {
			sendDesktopNotification(name + ' will join lunch at ' + ttl);
		} else {
			sendDesktopNotification(name + ' is hungry and proposes lunch at ' + ttl);
		}
	};

	var connect = function () {
		socket = new WebSocket(host);
		socket.onopen = connected;
		socket.onerror = reconnect;
	};


	connect();

	var checkVersion = function () {
		var transferData = {
			type: 'version'
		};
		sendSocketMessage(transferData);
	};

	var getBasicInformation = function() {
		var transferData = {
			type: 'hunger',
			audio: null,
			time: null,
			name: localStorage.name
		};
		sendSocketMessage(transferData);
	};

	var hasDesktopNotifactions = function () {
		return ("Notification" in window && Notification.permission !== 'denied');
	};

	var requestNotificationPermission = function () {
		if (hasDesktopNotifactions()) {
			Notification.requestPermission();
		}
	};

	var sendDesktopNotification = function(message) {
		if (hasDesktopNotifactions()) {
			var options = {
				body: message,
				lang: 'en',
				icon: '../../img/logo-square.png'
			};
			new Notification('Virtual Malte', options);
		}
	};

	$scope.sendFoodRequest = function($event) {
		var clickedElement = $($event.currentTarget);
		// Do nothing if the element is disabled
		if (clickedElement.hasClass('button-disabled')) {
			return;
		}
		var audio = clickedElement.attr('data-audio');
		var time = $scope.time;
		var transferData = {
			type: 'hunger',
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

	$scope.hasAttendees = function () {
		return $scope.attendees.length > 0;
	};

	requestNotificationPermission();
};
app.directive('clock', function() { 
	return { 
    	restrict: 'E',  
	    templateUrl:'./directives/clock/clock.html',
	    controller: 'ClockCtrl',
  	}; 
})

app.controller('ClockCtrl', function($scope, dashboardService, datastatesService, $interval){
	var tempTime = "";
	var dServiceObj = {};
	var colorAlarm = datastatesService.colorValues.alarmcolor; //Color red for alarm
    var colorCaution = datastatesService.colorValues.cautioncolor;// Color orange for caution
    var colorHealthy = datastatesService.colorValues.healthycolor;// Color green for healthy data
    var colorStale = datastatesService.colorValues.stalecolor;// Color staleblue for stale data
    var colorDisconnected = datastatesService.colorValues.disconnectedcolor;//Color grey for disconnected db
    var colorDefault = datastatesService.colorValues.defaultcolor;//Color black for default color
    var timerAlarm = false;

	$scope.statusIcons = dashboardService.icons;
	
	$scope.$watch('statusIcons',function(newVal,oldVal){
		dServiceObj = newVal; 
    },true);

    $scope.checkForClockData = function(){
    	if(!$scope.widget.settings.clocks){
			$scope.widget.settings.clocks = [{
				name : 'UTC',
				timezone : 'UTC',
			}];
		}

		// initialize clocks
		$scope.clocks = new Array();
		for (var i=0; i<$scope.widget.settings.clocks.length; i++) { 
			$scope.clocks[i] = {
				name : $scope.widget.settings.clocks[i].name,
				delta : '',
				time : {
					days : '000',
					minutes : '00',
					hours : '00',
					seconds : '00'
				},
				style : colorDefault
			}
		}
	}

	$scope.checkForClockData();

	$scope.updateClock = function(){
		for (var i=0; i<$scope.widget.settings.clocks.length; i++){
			
			if(typeof $scope.clocks[i] !== "object"){
				$scope.clocks[i] = new Object();
			}

			//Block to get time for Clock as per timezone
			if($scope.widget.settings.clocks[i].hasOwnProperty('timezone')) {
				$scope.clocks[i].name = $scope.widget.settings.clocks[i].name;
				$scope.clocks[i].time = dashboardService.getTime($scope.widget.settings.clocks[i].timezone);
				$scope.clocks[i].delta = "";

			} else { //Block for timer
				tempTime = dashboardService.countdown($scope.widget.settings.clocks[i].reference);
				$scope.clocks[i].name = $scope.widget.settings.clocks[i].name;
				$scope.clocks[i].time = tempTime;
				$scope.clocks[i].delta = tempTime.sign;

				if(tempTime.sign == "-"){
					if(tempTime.days == '000' && tempTime.hours == '00' && tempTime.minutes == '00') {
						if(tempTime.seconds <= '59' && tempTime.seconds > '10') {
							//timer color when it is between 10 and 59 seconds
							$scope.clocks[i].style = colorCaution;
						}
						if(tempTime.seconds <= '10') {
							//timer color when it is below 10 seconds
							$scope.clocks[i].style = colorAlarm;
						}
						if(tempTime.seconds == '00') {
							//alarm audio needs to be played
							timerAlarm = true;
						}
					} else {
						$scope.clocks[i].style = colorDefault;
					}
				} else {
					$scope.clocks[i].style = colorDefault;
				}
			}			
		}
	}

	$scope.interval = $interval($scope.updateClock, 500);

	//interval to check if the alarm audio needs to go off
	$scope.timerInterval = $interval(function(){
		if(timerAlarm){
			$scope.playAudio();
			timerAlarm = false;
		}
	}, 1500)

	$scope.remove = function($index) {
		$scope.widget.settings.clocks.splice($index, 1);
		$scope.clocks.splice($index, 1);
	}

	$scope.$on("$destroy", 
		function(event) {
			$interval.cancel( $scope.interval );
			$interval.cancel( $scope.timerInterval );
		}
	);

	$scope.playAudio = function() {
        var audio = new Audio('/media/audio/quindar.mp3');
        audio.play();
    };

})
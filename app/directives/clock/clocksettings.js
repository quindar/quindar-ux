app.directive('clocksettings', function() { 
	return { 
    	restrict: 'E',  
	    templateUrl:'./directives/clock/clocksettings.html',
	    controller: 'ClockSettingsCtrl',
  	}; 
})

app.controller('ClockSettingsCtrl', function($scope){
	$scope.closeSettings = function(widget){
		widget.main = true;
		widget.settings.active = false;
		widget.saveLoad = false;
		widget.delete = false;
	}

	$scope.saveSettings = function(widget){
		widget.main = true;
		widget.settings.active = false;
		widget.saveLoad = false;
		widget.delete = false;
		//widget.settings.vehicle = $scope.selected.vehicle.value;
		//console.log($scope.selected);
	}

	$scope.selected = {};
	$scope.isLoaded = false;

	$scope.types = [
	{
        'key': 1,
        'value': 'Clock'
    }, 
	{
		'key': 2,
		'value': 'Timer'
	}];

	$scope.timezones = [
	{
        'key': 1,
		'value': 'UTC',
		'zone': 0
	}, 
	{
		'key': 2,
		'value': 'San Francisco',
		'zone': -8
	}, 
	{
		'key': 3,
		'value': 'Singapore',
		'zone': 8
	}, 
	{
		'key': 4,
		'value': 'Luxembourg',
		'zone': 2
	}];

})
app
.directive('satellitesettings', function() {
    return {
        restrict: 'E',
        templateUrl:'./directives/satellite/satellitesettings.html',
        controller: 'SatSettingsCtrl'
    }
});

app.controller('SatSettingsCtrl', function($scope, dashboardService, sidebarService, $window, $mdSidenav,$uibModal){

    $scope.chosenCategory;
    $scope.attitudeBooleans = [true, true, true, true];
    $scope.positionBooleans = [true, true, true, true];
    checkforPreSavedData();
    $scope.attitudeInputStyles={};
    $scope.positionInputStyles={};
    $scope.attitudeBtnStyles={};
    $scope.positionBtnStyles={};
    $scope.attitudeparametersErrMsg = "";
    $scope.positionparametersErrMsg = "";

	$scope.closeSettings = function(widget){
		widget.main = true;
		widget.settings.active = false;
		widget.saveLoad = false;
		widget.delete = false;

        var prevValues = angular.copy(widget.settings);

		if(prevValues.attitudeData && prevValues.positionData){
			$scope.settings.attitudeData = prevValues.attitudeData;
            $scope.widget.settings.totalAttitudeArray = angular.copy($scope.widget.settings.attitudeData);
		
			$scope.settings.positionData = prevValues.positionData;
            $scope.widget.settings.totalPositionArray = angular.copy($scope.widget.settings.positionData);
		
			$scope.vehicle = prevValues.vehicle;

		}else if(!prevValues.attitudeData && prevValues.positionData){
			$scope.settings.positionData = prevValues.positionData;
            $scope.widget.settings.totalPositionArray = angular.copy($scope.widget.settings.positionData);
		
			$scope.vehicle = prevValues.vehicle;

		}else if(prevValues.attitudeData && !prevValues.positionData){
			$scope.settings.attitudeData = prevValues.attitudeData;
            $scope.widget.settings.totalAttitudeArray = angular.copy($scope.widget.settings.attitudeData);

			$scope.vehicle = prevValues.vehicle;

		}else {
			$scope.settings.attitudeData = [];
			$scope.settings.positionData = [];
            $scope.widget.settings.totalAttitudeArray = [];
            $scope.widget.settings.totalPositionArray = [];

		}

        if ($window.innerWidth > 1440)
        {
            $scope.lock = dashboardService.getLock();
            $scope.lock.lockLeft = false;
            dashboardService.setLeftLock($scope.lock.lockLeft);
        }

        $scope.attitudeBooleans = [true, true, true, true];
        $scope.positionBooleans = [true, true, true, true];
        $scope.attitudeInputStyles={};
        $scope.attitudeBtnStyles={};
        $scope.positionInputStyles={};
        $scope.positionBtnStyles={};
        $scope.attitudeparametersErrMsg = "";
        $scope.positionparametersErrMsg = "";
	}

	$scope.saveSettings = function(widget){
		var status = checkforSameVehicle($scope.settings.attitudeData,$scope.settings.positionData);
        $scope.positionparametersErrMsg = "";
        $scope.attitudeparametersErrMsg = "";
        $scope.positionInputStyles = {};
        $scope.positionBtnStyles = {};
        $scope.attitudeInputStyles={};
        $scope.attitudeBtnStyles = {};
        if($scope.widget.settings.totalAttitudeArray.length === 0 ){
            $scope.attitudeparametersErrMsg = "Please fill out this field.";
            $scope.attitudeInputStyles={'border-color':'#dd2c00'};
            $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            if($scope.widget.settings.totalPositionArray.length === 0){ // When select position field is untouched
                $scope.positionparametersErrMsg = "Please fill out this field.";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.positionBooleans[3]){ 
                $scope.positionparametersErrMsg = "Required: All position coordinates(x,y,z)!";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.positionBooleans[2]){ 
                $scope.positionparametersErrMsg = "Coordinates selected from different vehicles.Select from single vehicle!";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }
            // else if(!$scope.positionBooleans[0]){
            //     $scope.positionparametersErrMsg = "Required: All position coordinates(x,y,z)!";
            //     $scope.positionInputStyles = {'border-color':'#dd2c00'};
            //     $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            // }
        }
        else if(!$scope.attitudeBooleans[3])
        {
           $scope.attitudeparametersErrMsg = "Required: All attitude coordinates(q1,q2,q3,qc)!";
            $scope.attitudeInputStyles={'border-color':'#dd2c00'};
            $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            if($scope.widget.settings.totalPositionArray.length === 0){ // When select position field is untouched
                $scope.positionparametersErrMsg = "Please fill out this field.";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.positionBooleans[3]){ 
                $scope.positionparametersErrMsg = "Required: All position coordinates(x,y,z)!";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.positionBooleans[2]){ 
                $scope.positionparametersErrMsg = "Coordinates selected from different vehicles.Select from single vehicle!";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }
            // else if(!$scope.positionBooleans[0]){
            //     $scope.positionparametersErrMsg = "Required: All position coordinates(x,y,z)!";
            //     $scope.positionInputStyles = {'border-color':'#dd2c00'};
            //     $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            // }
        }
        else if(!$scope.attitudeBooleans[2])
        {
            $scope.attitudeparametersErrMsg = "Coordinates selected from different vehicles.Select from single vehicle!";
            $scope.attitudeInputStyles={'border-color':'#dd2c00'};
            $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            if($scope.widget.settings.totalPositionArray.length === 0){ // When select position field is untouched
                $scope.positionparametersErrMsg = "Please fill out this field.";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.positionBooleans[3]){ 
                $scope.positionparametersErrMsg = "Required: All position coordinates(x,y,z)!";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.positionBooleans[2]){ 
                $scope.positionparametersErrMsg = "Coordinates selected from different vehicles.Select from single vehicle!";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }
            // else if(!$scope.positionBooleans[0]){
            //     $scope.positionparametersErrMsg = "Required: All position coordinates(x,y,z)!";
            //     $scope.positionInputStyles = {'border-color':'#dd2c00'};
            //     $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            // }
        }
        else if(!$scope.attitudeBooleans[0])
        {
            $scope.attitudeparametersErrMsg = "Required: All attitude coordinates(q1,q2,q3,qc)!";
            $scope.attitudeInputStyles={'border-color':'#dd2c00'};
            $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            if($scope.widget.settings.totalPositionArray.length === 0){ // When select position field is untouched
                $scope.positionparametersErrMsg = "Please fill out this field.";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.positionBooleans[3]){ 
                $scope.positionparametersErrMsg = "Required: All position coordinates(x,y,z)!";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.positionBooleans[2]){ 
                $scope.positionparametersErrMsg = "Coordinates selected from different vehicles.Select from single vehicle!";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }
            // else if(!$scope.positionBooleans[0]){
            //     $scope.positionparametersErrMsg = "Required: All position coordinates(x,y,z)!";
            //     $scope.positionInputStyles = {'border-color':'#dd2c00'};
            //     $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            // }
        }
        else if($scope.widget.settings.totalPositionArray.length === 0){
            $scope.positionparametersErrMsg = "Please fill out this field.";
            $scope.positionInputStyles = {'border-color':'#dd2c00'};
            $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            if($scope.widget.settings.totalAttitudeArray.length === 0){
                $scope.attitudeparametersErrMsg = "Please fill out this field.";
                $scope.attitudeInputStyles={'border-color':'#dd2c00'};
                $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.attitudeBooleans[3]){
                $scope.attitudeparametersErrMsg = "Required: All position coordinates(x,y,z)!";
                $scope.attitudeInputStyles = {'border-color':'#dd2c00'};
                $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.attitudeBooleans[2]){
                $scope.attitudeparametersErrMsg = "Coordinates selected from different vehicles.Select from single vehicle!";
                $scope.attitudeInputStyles = {'border-color':'#dd2c00'};
                $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            }
            // else if(!$scope.attitudeBooleans[0]){
            //     $scope.attitudeparametersErrMsg = "Required: All position coordinates(x,y,z)!";
            //     $scope.attitudeInputStyles = {'border-color':'#dd2c00'};
            //     $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            // }
        }
        else if(!$scope.positionBooleans[3])
        {
            $scope.positionparametersErrMsg = "Required: All position coordinates(x,y,z)!";
            $scope.positionInputStyles = {'border-color':'#dd2c00'};
            $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            if($scope.widget.settings.totalAttitudeArray.length === 0){
                $scope.attitudeparametersErrMsg = "Please fill out this field.";
                $scope.attitudeInputStyles={'border-color':'#dd2c00'};
                $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.attitudeBooleans[3]){
                $scope.attitudeparametersErrMsg = "Required: All position coordinates(x,y,z)!";
                $scope.attitudeInputStyles = {'border-color':'#dd2c00'};
                $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.attitudeBooleans[2]){
                $scope.attitudeparametersErrMsg = "Coordinates selected from different vehicles.Select from single vehicle!";
                $scope.attitudeInputStyles = {'border-color':'#dd2c00'};
                $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            }
            // else if(!$scope.attitudeBooleans[0]){
            //     $scope.attitudeparametersErrMsg = "Required: All position coordinates(x,y,z)!";
            //     $scope.attitudeInputStyles = {'border-color':'#dd2c00'};
            //     $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            // }
        }
        else if(!$scope.positionBooleans[2])
        {
            $scope.positionparametersErrMsg = "Coordinates selected from different vehicles.Select from single vehicle!";
            $scope.positionInputStyles = {'border-color':'#dd2c00'};
            $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            if($scope.widget.settings.totalAttitudeArray.length === 0){
                $scope.attitudeparametersErrMsg = "Please fill out this field.";
                $scope.attitudeInputStyles={'border-color':'#dd2c00'};
                $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.attitudeBooleans[3]){
                $scope.attitudeparametersErrMsg = "Required: All position coordinates(x,y,z)!";
                $scope.attitudeInputStyles = {'border-color':'#dd2c00'};
                $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.attitudeBooleans[2]){
                $scope.attitudeparametersErrMsg = "Coordinates selected from different vehicles.Select from single vehicle!";
                $scope.attitudeInputStyles = {'border-color':'#dd2c00'};
                $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            }
            // else if(!$scope.attitudeBooleans[0]){
            //     $scope.attitudeparametersErrMsg = "Required: All position coordinates(x,y,z)!";
            //     $scope.attitudeInputStyles = {'border-color':'#dd2c00'};
            //     $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            // }
        }
        else if(!$scope.positionBooleans[0])
        {
            $scope.positionparametersErrMsg = "Required: All position coordinates(x,y,z)!";
            $scope.positionInputStyles = {'border-color':'#dd2c00'};
            $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            if($scope.widget.settings.totalAttitudeArray.length === 0){
                $scope.attitudeparametersErrMsg = "Please fill out this field.";
                $scope.attitudeInputStyles={'border-color':'#dd2c00'};
                $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.attitudeBooleans[3]){
                $scope.attitudeparametersErrMsg = "Required: All position coordinates(x,y,z)!";
                $scope.attitudeInputStyles = {'border-color':'#dd2c00'};
                $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.attitudeBooleans[2]){
                $scope.attitudeparametersErrMsg = "Coordinates selected from different vehicles.Select from single vehicle!";
                $scope.attitudeInputStyles = {'border-color':'#dd2c00'};
                $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            }
            // else if(!$scope.attitudeBooleans[0]){
            //     $scope.attitudeparametersErrMsg = "Required: All position coordinates(x,y,z)!";
            //     $scope.attitudeInputStyles = {'border-color':'#dd2c00'};
            //     $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            // }
        }
        else if($scope.widget.settings.totalAttitudeArray.length === 4 && $scope.widget.settings.totalPositionArray.length === 3 && status === true){
            $uibModal.open({
                templateUrl: "./directives/satellite/confirmSettings.html",
                controller: 'confirmCtrl',
                controllerAs: '$ctrl',
                bindToController: true,
                scope: $scope,
                resolve: {
                    dataLabel: function () {
                        return "Did you select quaternion coordinates(q1,q2,q3,qc) and position coordinates(x,y,z)?";
                    },
                    dataItems: function(){
                        return $scope.settings;
                    }
                }
            }).result.then(function(dataItems){
                //handle modal close with response
                widget.main = true;
                widget.settings.active = false;
                widget.saveLoad = false;
                widget.delete = false;

                widget.settings.attitudeData = getSelectedArray(dataItems.attitudeData);
                widget.settings.positionData = getSelectedArray(dataItems.positionData);
                widget.settings.vehicle = $scope.vehicle;

                //reset arrays that handle data selected by the user
                $scope.widget.settings.totalAttitudeArray = getRecentSelectedValues($scope.widget.settings.totalAttitudeArray, 4);
                $scope.widget.settings.totalPositionArray = getRecentSelectedValues($scope.widget.settings.totalPositionArray, 3);
                widget.settings.dataArray = [];

                if ($window.innerWidth > 1440){
                    $scope.lock = dashboardService.getLock();
                    $scope.lock.lockLeft = false;
                    dashboardService.setLeftLock($scope.lock.lockLeft);
                }
 
                $scope.attitudeBooleans = [true, true, true, true];
                $scope.positionBooleans = [true, true, true, true];
                $scope.attitudeInputStyles={};
                $scope.attitudeBtnStyles={};
                $scope.positionInputStyles={};
                $scope.positionBtnStyles={};
                $scope.attitudeparametersErrMsg = "";
                $scope.positionparametersErrMsg = "";
            },
            function () {
            //handle modal dismiss
                $scope.attitudeBooleans = [true, true, true, true];
                $scope.positionBooleans = [true, true, true, true];
                $scope.attitudeInputStyles={};
                $scope.attitudeBtnStyles={};
                $scope.positionInputStyles={};
                $scope.positionBtnStyles={};
                $scope.attitudeparametersErrMsg = "";
                $scope.positionparametersErrMsg = "";
            });
        }
        else if(status === false)
        {
            $scope.attitudeparametersErrMsg = "Vehicles of both fields do not match! Selected from vehicle: "+$scope.currentAttitudeVehicle;
            $scope.positionparametersErrMsg = "Vehicles of both fields do not match! Selected from vehicle: "+$scope.currentPositionVehicle;
            $scope.attitudeInputStyles = {'border-color':'#dd2c00'};
            $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            $scope.positionInputStyles = {'border-color':'#dd2c00'};
            $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
        }
	}

	$scope.getTelemetrydata = function(category){
        //open the data menu
        $scope.chosenCategory = category; //which input box has been selected (position or velocity)
        sidebarService.setTempWidget($scope.widget, this); //which input box has been selected (position or velocity)
        if ($window.innerWidth <= 1440){
            $mdSidenav('left').open();
        } else {
            $scope.lock = dashboardService.getLock();
            $scope.lock.lockLeft = true;
            dashboardService.setLeftLock($scope.lock.lockLeft);
        }
        sidebarService.setMenuStatus(true); //set to true when data menu is opened and tree needs to be created
        sidebarService.setOpenLogo(false); //set to false if data menu opened through this Qwidget
    }

    //display telemetry id chosen by the user in the right input box
    $scope.readValues = function(field)
    {
        var trimmedData = [];
        // var stringData = "";
        $scope.stringPositionData = "";
        $scope.stringAttitudeData = "";

        if(field == 'attitude')
        {
            if($scope.widget.settings.totalAttitudeArray)
            {
                trimmedData = getRecentSelectedValues($scope.widget.settings.totalAttitudeArray, 4);
            }

            for(var i = 0; i < trimmedData.length; i++)
            {
                if(trimmedData[i])
                {
                    if(i == trimmedData.length - 1)
                    {
                        $scope.stringAttitudeData += trimmedData[i].id
                    }
                    else
                    {
                        $scope.stringAttitudeData += trimmedData[i].id + ", ";
                    }
                }
            }
            if($scope.stringAttitudeData)
            {
                return $scope.stringAttitudeData;
            }
            else
            {
                return "";
            }
        }
        else if(field == 'position')
        {
            if($scope.widget.settings.totalPositionArray)
            {
                trimmedData = getRecentSelectedValues($scope.widget.settings.totalPositionArray, 3);
            }

            for(var i = 0; i < trimmedData.length; i++)
            {
                if(trimmedData[i])
                {
                    if(i == trimmedData.length - 1)
                    {
                         $scope.stringPositionData += trimmedData[i].id
                    }
                    else
                    {
                         $scope.stringPositionData += trimmedData[i].id + ", ";
                    }
                }
            }

            if( $scope.stringPositionData)
            {
                return  $scope.stringPositionData;
            }
            else
            {
                return "";
            }
        }
    }

    $scope.sortableOptionsAttitude = {
        containment: '#scrollable-containerAttitude',
        scrollableContainer: '#scrollable-containerAttitude',
        //restrict move across columns. move only within column.
        accept: function (sourceItemHandleScope, destSortableScope) {
            return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
        }
    };

    $scope.sortableOptionsPosition = {
        containment: '#scrollable-containerPosition',
        scrollableContainer: '#scrollable-containerPosition',
        //restrict move across columns. move only within column.
        accept: function (sourceItemHandleScope, destSortableScope) {
            return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
        }
    };

    $scope.getValue = function(isGroup){
        var vehicleInfo = angular.copy($scope.widget.settings.dataArray);
        var dataLen = vehicleInfo.length;
        var data = $scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1];
        if(!isGroup && data && data.id !== "") //as long as data is id and not group
        {
            //$scope.attitudeBooleans = [true, true, true, true]; //boolean array to keep track of which conditions the attitude data selected doesn't pass
            //$scope.positionBooleans = [true, true, true, true]; //boolean array to keep track of which conditions the position data selected doesn't pass
 
            if($scope.chosenCategory == 'attitude') //if the attitude input box has been chosen
            {
                //push the last chosen data value into the corresponding attitude array
                $scope.widget.settings.totalAttitudeArray.push($scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1]);
            }
            else if($scope.chosenCategory == 'position') //if the position input box has been chosen
            {
                //push the last chosen data value into the corresponding position array
                $scope.widget.settings.totalPositionArray.push($scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1]);
            }
            
            var attitudeArray = [];
            var attitudeSettings = [];

            attitudeArray = angular.copy($scope.widget.settings.totalAttitudeArray);

            //if the temp attitude array has length more than 4 then reduce its size to recent 4
            if(attitudeArray.length > 4){
                attitudeSettings = getRecentSelectedValues(attitudeArray,4);
            }else {
                attitudeSettings = attitudeArray;
            }
            
            if(attitudeSettings.length === 4){
                var attitudeSettingsfiltered1 = removeCategories(attitudeSettings); //to remove selected group or categories while opening the list
               // var attitudeSettingsfiltered2 = removeDuplicates(attitudeSettingsfiltered1,"id");// to remove duplicate selection of a single value
                var isDiffAttitudeVeh = isAnyDiffVehicles(attitudeSettingsfiltered1);// to check if all the values are of the same vehicle
               // var attitudefilteredData = filterSelectedData(attitudeSettingsfiltered2); // check if there are any different values of a category
               // if(isDiffAttitudeVeh === false && attitudefilteredData.length === attitudeSettingsfiltered2.length){ // condition to check if the values are of same vehicle and same category
                if(isDiffAttitudeVeh === false && attitudeSettingsfiltered1.length === 4){    
                    if(attitudeSettingsfiltered1.length === 4){  
                        $scope.settings.attitudeData = attitudeSettingsfiltered1;
                        $scope.vehicle = attitudeSettingsfiltered1[0].vehicle;
                        $scope.widget.settings.totalAttitudeArray = angular.copy(attitudeSettingsfiltered1);
                        $scope.attitudeBooleans[0] = true;
                        $scope.attitudeBooleans[1] = true;
                        $scope.attitudeBooleans[2] = true;
                        $scope.attitudeBooleans[3] = true;
                    }
                    // else if(attitudeSettingsfiltered1.length < 4){
                    //     $scope.attitudeBooleans[0] = false;
                    //     $scope.attitudeBooleans[1] = true;
                    //     $scope.attitudeBooleans[2] = true;
                    //     $scope.attitudeBooleans[3] = true;
                    // }
                }else if(attitudeSettingsfiltered1.length < 4){
                    $scope.attitudeBooleans[0] = false;
                    $scope.attitudeBooleans[1] = true;
                    $scope.attitudeBooleans[2] = true;
                    $scope.attitudeBooleans[3] = true;
                }
                else if(isDiffAttitudeVeh === false){
                    $scope.attitudeBooleans[1] = false;
                    $scope.attitudeBooleans[0] = true;
                    $scope.attitudeBooleans[2] = true;
                    $scope.attitudeBooleans[3] = true;
                }else if(isDiffAttitudeVeh === true && attitudeSettingsfiltered1.length === 4){
                    //$scope.attitudeparametersErrMsg = "";
                    $scope.attitudeBooleans[2] = false;
                    $scope.attitudeBooleans[0] = true;
                    $scope.attitudeBooleans[1] = true;
                    $scope.attitudeBooleans[3] = true;
                }else if(isDiffAttitudeVeh === true && attitudeSettingsfiltered1.length !== 4){
                    $scope.attitudeBooleans[2] = false;
                    $scope.attitudeBooleans[0] = true;
                    $scope.attitudeBooleans[1] = true;
                    $scope.attitudeBooleans[3] = true;
                }
            }else {
                $scope.attitudeBooleans[3] = false;
                $scope.attitudeBooleans[0] = true;
                $scope.attitudeBooleans[1] = true;
                $scope.attitudeBooleans[2] = true;
            }  
            
        
            var positionArray = [];
            var positionSettings = [];

            positionArray = angular.copy($scope.widget.settings.totalPositionArray);

            //if the temp position array has length more than 3 then reduce its size to recent 3
            if(positionArray.length > 3){
                positionSettings = getRecentSelectedValues(positionArray,3);
            }else {
                positionSettings = positionArray;
            }
            
            if(positionSettings.length === 3){
                var positionSettingsfiltered1 = removeCategories(positionSettings);//to remove selected group or categories while opening the list
               // var positionSettingsfiltered2 = removeDuplicates(positionSettingsfiltered1,"id");// to remove duplicate selection of a single value
                var isDiffPositionVeh = isAnyDiffVehicles(positionSettingsfiltered1);// to check if all the values are of the same vehicle
               // var positionfilteredData = filterSelectedData(positionSettingsfiltered2);// check if there are any different values of a category
        
                //if(isDiffPositionVeh === false && positionfilteredData.length === positionSettingsfiltered2.length){ // condition to check if the values are of same vehicle and same category
                if(isDiffPositionVeh === false && positionSettingsfiltered1.length === 3){     
                    if(positionSettingsfiltered1.length === 3){  
                        $scope.settings.positionData = positionSettingsfiltered1;
                        $scope.vehicle = positionSettingsfiltered1[0].vehicle;
                        $scope.widget.settings.totalPositionArray = angular.copy(positionSettingsfiltered1);
                        $scope.positionBooleans[0] = true;
                        $scope.positionBooleans[1] = true;
                        $scope.positionBooleans[2] = true;
                        $scope.positionBooleans[3] = true;
                    }
                    // else if(positionSettingsfiltered1.length < 3){
                    //     $scope.positionBooleans[0] = false;
                    //     $scope.positionBooleans[1] = true;
                    //     $scope.positionBooleans[2] = true;
                    //     $scope.positionBooleans[3] = true;
                    // }
                }else if(positionSettingsfiltered1.length < 3){
                    $scope.positionBooleans[0] = false;
                    $scope.positionBooleans[1] = true;
                    $scope.positionBooleans[2] = true;
                    $scope.positionBooleans[3] = true;
                }
                else if(isDiffPositionVeh === false){
                    $scope.positionBooleans[1] = false;
                    $scope.positionBooleans[0] = true;
                    $scope.positionBooleans[2] = true;
                    $scope.positionBooleans[3] = true;
                }else if(isDiffPositionVeh === true && positionSettingsfiltered1.length === 3){
                    $scope.positionBooleans[2] = false;
                    $scope.positionBooleans[0] = true;
                    $scope.positionBooleans[1] = true;
                    $scope.positionBooleans[3] = true;
                }else if(isDiffPositionVeh === true && positionSettingsfiltered1.length !== 3){
                    $scope.positionBooleans[2] = false;
                    $scope.positionBooleans[0] = true;
                    $scope.positionBooleans[1] = true;
                    $scope.positionBooleans[3] = true;
                }
            }else {
                $scope.positionBooleans[3] = false;
                $scope.positionBooleans[0] = true;
                $scope.positionBooleans[1] = true;
                $scope.positionBooleans[2] = true;
            }          
        }
    }

    function filterSelectedData(selectedArray){
    	var tagArray = [];
    	var mostCommonTag = "";
        var arrayLen = selectedArray.length;
    	for(var i=0;i<arrayLen;i++){
    		tagArray.push({"category":selectedArray[i].category,"vehicle":selectedArray[i].vehicle});
    	}

    	var mf = 1;
		var m = 0;
		var item;
        var tagArrayLen = tagArray.length;
		for (var j=0; j<tagArrayLen; j++)
		{
        	for (var p=j; p<tagArrayLen; p++)
        	{
                if (tagArray[j].category === tagArray[p].category && tagArray[j].vehicle === tagArray[p].vehicle)
                 m++;
                if (mf<m)
                {
                  mf=m; 
                  item = tagArray[j];
                }
        	}
        	m=0;
		}

    	var filteredArray = [];

        if(item){
            for(var k=0;k<arrayLen;k++){
                if(selectedArray[k].category === item.category && selectedArray[k].vehicle === item.vehicle){
                    filteredArray.push(selectedArray[k]);
                }
            }
            return filteredArray;
        }else {
            return [];
        }

    }

    function getRecentSelectedValues(selectedArray,count){
    	var parameters = [];
        var arrayLen = selectedArray.length;
    	for(var i=arrayLen-count;i<arrayLen;i++){
    		parameters.push(selectedArray[i]);
    	}
    	return parameters;
    }

    function checkforSameVehicle(attitudeData,positionData){
    	var status = true;
        var attDataLen = attitudeData.length;
        var posDataLen = positionData.length;
    	for(var i=0;i<attDataLen;i++){
    		for(var j=0;j<posDataLen;j++){
    			if(attitudeData[i].vehicle !== positionData[j].vehicle){
    				status = false;
                    $scope.currentAttitudeVehicle = attitudeData[i].vehicle;
                    $scope.currentPositionVehicle = positionData[j].vehicle;
    			}
    		}
    	}
    	return status;
    }

    function checkforPreSavedData(){
    	if($scope.widget.settings.attitudeData && $scope.widget.settings.positionData){
            var preSavedValues = angular.copy($scope.widget.settings);
    		$scope.settings = {
        		attitudeData:preSavedValues.attitudeData,
        		positionData:preSavedValues.positionData
    		};

            $scope.vehicle = preSavedValues.vehicle
            $scope.widget.settings.totalPositionArray = angular.copy($scope.widget.settings.positionData);
            $scope.widget.settings.totalAttitudeArray = angular.copy($scope.widget.settings.attitudeData);
    	}else if(!$scope.widget.settings.attitudeData && !$scope.widget.settings.positionData){
    		$scope.settings = {
        		attitudeData:[],
        		positionData:[],
    		};

            $scope.widget.settings.totalPositionArray = [];
            $scope.widget.settings.totalAttitudeArray = [];

            $scope.vehicle = "";
    	}
    }

    function getSelectedArray(selectedArray){
    	var data = [];
        var arrayLen = selectedArray.length;
    	for(var b=0;b<arrayLen;b++){
			data.push(selectedArray[b]);
		}
		return data;
    }

    function removeDuplicates(originalArray, prop) {
        var newArray = [];
        var lookupObject  = {};

        for(var i in originalArray) {
            lookupObject[originalArray[i][prop]] = originalArray[i];
        }

        for(i in lookupObject) {
            newArray.push(lookupObject[i]);
        }

        return newArray;
    }

    function removeCategories(filteredArray){
        var data = [];
        var arrayLen = filteredArray.length;
        for(var i=0;i<arrayLen;i++){
            var datavalue = dashboardService.getData(filteredArray[i].key);
            if(datavalue){
                if(datavalue.hasOwnProperty("value")){
                    data.push(filteredArray[i]);
                }
            }
        }
        return data;
    }

    function isAnyDiffVehicles(filteredArray){
        var arrayLen = filteredArray.length;
        var count = 0;
        for(var i = 1; i < arrayLen; i++){
            if(filteredArray[i].vehicle !== filteredArray[0].vehicle){
                count++;
            }
        }

        if(count > 0){
            return true;
        }else {
            return false;
        }
    }

	$scope.openAttitudeList = function() {
		// Just provide a template url, a controller and call 'open'.
        $scope.settings.tempAttitudes = angular.copy(getRecentSelectedValues($scope.widget.settings.totalAttitudeArray, 4)); 
        $uibModal.open({
            templateUrl: "./directives/satellite/quaternionList.html",
            controller: 'attitudeListCtrl',
            controllerAs: '$ctrl',
            resolve: {
                attitudeItems: function () {
                    return $scope.settings;
                }
            }
        }).result.then(
            function(dataItems){
                //handle modal close with response
                if(dataItems.tempAttitudes.length === 4){
                    $scope.widget.settings.totalAttitudeArray = angular.copy(dataItems.tempAttitudes);
                    $scope.settings.attitudeData = angular.copy($scope.widget.settings.totalAttitudeArray);
                }
            },
            function () {
                //handle modal dismiss
            });
		};

	$scope.openPositionList = function() {
		// Just provide a template url, a controller and call 'open'.
        $scope.settings.tempPositions = angular.copy(getRecentSelectedValues($scope.widget.settings.totalPositionArray, 3)); 
        $uibModal.open({
            templateUrl: "./directives/satellite/positionList.html",
            controller: 'positionListCtrl',
            controllerAs: '$ctrl',
            resolve: {
                positionItems: function () {
                   	return $scope.settings;
                }
            }
        }).result.then(function(dataItems){ //dataItems = $scope.widget.settings
            //handle modal close with response
            if(dataItems.tempPositions.length === 3){
                $scope.widget.settings.totalPositionArray = angular.copy(dataItems.tempPositions);
                $scope.settings.positionData = angular.copy($scope.widget.settings.totalPositionArray);
            }
        },
        function () {
            //handle modal dismiss
        });
	};
});


app.controller('positionListCtrl',function($scope,$uibModalInstance,positionItems,$uibModal) {
    var $ctrl = this;
    $ctrl.data = positionItems;
    var values = angular.copy(positionItems);

    $ctrl.close = function() {
        $ctrl.data.tempPositions = values.tempPositions;
        $uibModalInstance.dismiss('cancel');
    };

    $ctrl.save = function(){
        $uibModal.open({
            templateUrl: "./directives/satellite/confirmParameter.html",
            controller: 'confirmCtrl',
            controllerAs: '$ctrl',
            resolve: {
                dataLabel: function () {
                    return "Is the position coordinates selected order is:x,y,z?";
                },
                dataItems: function(){
                    return $ctrl.data;
                }
            }
        }).result.then(function(dataItems){
            //handle modal close with response
            $uibModalInstance.close(dataItems);
        },
        function () {
            //handle modal dismiss
        });
    }
});

app.controller('attitudeListCtrl',function($scope,$uibModalInstance,attitudeItems,$uibModal) {
    var $ctrl = this;
    $ctrl.data = attitudeItems;
    var values = angular.copy(attitudeItems);

    $ctrl.close = function() {
        $ctrl.data.tempAttitudes = values.tempAttitudes;
        $uibModalInstance.dismiss('cancel');
    };

    $ctrl.save = function(){
        $uibModal.open({
            templateUrl: "./directives/satellite/confirmParameter.html",
            controller: 'confirmCtrl',
            controllerAs: '$ctrl',
            resolve: {
                dataLabel: function () {
                    return "Is the quaternion coordinates selected order is:q1,q2,q3,qc?";
                },
                dataItems: function(){
                    return $ctrl.data;
                }
            }
        }).result.then(function(dataItems){
            //handle modal close with response
            $uibModalInstance.close(dataItems);
        },
        function () {
            //handle modal dismiss
        });
    }
});

app.controller('confirmCtrl',function($scope,$uibModalInstance,dataLabel,dataItems) {
    var $ctrl = this;
    $ctrl.modalLabel = dataLabel;
    $ctrl.finalData = dataItems;
    $ctrl.close = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $ctrl.save = function(){
        $uibModalInstance.close($ctrl.finalData);
    }
});


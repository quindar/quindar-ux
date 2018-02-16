app.directive('datatable',function() { 
  return { 
    restrict: 'E', 
    templateUrl:'./directives/datatable/datatable.html',
    controller: 'DataTableCtrl',
    controllerAs: 'vm',
    bindToController: true              
    }; 
});

app.controller('DataTableCtrl',function ($scope,$mdSidenav,$window,$interval,$timeout,dashboardService,sidebarService,datastatesService) {  

    //Get values of the checkboxes in settings category display
    $scope.checkedValues = $scope.widget.settings.checkedValues;
    var tableCols = []; // table column data
    var tempvalue = [];
    $scope.dataStatus = dashboardService.icons;
    var dServiceObjVal = {};
    var colorAlarm = datastatesService.colorValues.alarmcolor; //Color red for alarm
    var colorCaution = datastatesService.colorValues.cautioncolor;// Color orange for caution
    var colorHealthy = datastatesService.colorValues.healthycolor;// Color green for healthy data
    var colorStale = datastatesService.colorValues.stalecolor;// Color staleblue for stale data
    var colorDisconnected = datastatesService.colorValues.disconnectedcolor;//Color grey for disconnected db
    var colorDefault = datastatesService.colorValues.defaultcolor;//Color black for default color
    var textLeft = {'text-align':'left'};
    var textRight = {'text-align':'right'};
    var roweffect = { 
                        'background-color':'#CFCFD5',
                        'animation': 'background-fade 0.5s forwards',
                        '-webkit-animation': 'background-fade 0.5s forwards',
                        '-moz-animation': 'background-fade 0.5s forwards'
                    };
    //watch to check the database icon color to know about database status
    $scope.$watch('dataStatus',function(newVal,oldVal){
        dServiceObjVal = newVal; 
    },true);

    var num_of_rows = 39;

    //Default table structure -contains 120 rows to best appear for small and large screens
    for (var i = 0; i <= num_of_rows; i++) {
        tableCols.push({
            contents: [
            {   
                "datavalue":"",
                "checked":"true",
                "style":textLeft,
                "colshow":"checkedValues.checkedId",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textLeft,
                "colshow":"checkedValues.checkedName",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textRight,
                "colshow":"checkedValues.checkedAlow",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textRight,
                "colshow":"checkedValues.checkedWlow",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textRight,
                "colshow":"checkedValues.checkedValue",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textRight,
                "colshow":"checkedValues.checkedWhigh",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textRight,
                "colshow":"checkedValues.checkedAhigh",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textLeft,
                "colshow":"checkedValues.checkedUnits",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textLeft,
                "colshow":"checkedValues.checkedNotes",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            }],
            disabled: false
        });      
    }

    //Function to select telemetry Id
    $scope.getTelemetrydata = function($event){
        var arrow = $event.target.parentElement.parentElement.parentElement.firstElementChild.firstElementChild;
        arrow.style.color = "#07D1EA";

        if ($window.innerWidth < 1400){
            $mdSidenav('left').open();
        } else {
            $scope.lock = dashboardService.getLock();
            if($scope.lock.lockLeft !== true) {
                $scope.lock.lockLeft = !$scope.lock.lockLeft;
                dashboardService.setLeftLock($scope.lock.lockLeft);
            }
        }
    }

    //Function to display selected telemetry Id value and its corresponding data values.
    $scope.getValue = function($event, row, $index){
        var vehicleInfo = sidebarService.getVehicleInfo();
        var arrow = $event.target.parentElement.parentElement.parentElement.firstElementChild.firstElementChild;

        if(vehicleInfo.key) {
            var data = dashboardService.getData(vehicleInfo.key);

            if(data.hasOwnProperty("value")){
                $scope.widget.settings.data[$index] = new Object();
                $scope.widget.settings.data[$index].type = "data";
                $scope.widget.settings.data[$index].value = vehicleInfo.key;

                arrow.style.color = "#b3b3b3";
                if ($window.innerWidth >= 1400){
                    if($scope.lock.lockLeft !== false){
                        $scope.lock.lockLeft = !$scope.lock.lockLeft;
                        dashboardService.setLeftLock($scope.lock.lockLeft);
                    }
                }
            } else {
                arrow.style.color = "#07D1EA";
                $window.alert("Please select telemetry ID(leaf node) from Data Menu");
            }
        } else {
            arrow.style.color = "#07D1EA";
            $window.alert("Vehicle data not set. Please select from Data Menu");
        }
    }

    //function to assign key to specific row indices for the selected group
    $scope.applyGroup = function($event, row, $index){
        var vehicleInfo = sidebarService.getVehicleInfo();
        var arrow = $event.target.parentElement.parentElement.parentElement.firstElementChild.firstElementChild;

        var grpkey = vehicleInfo.key;
        
        if(grpkey) {
            var data = dashboardService.getData(grpkey);

            if(!data.hasOwnProperty("value")){
                var idList = Object.keys(data);

                for(var i=0; i<idList.length; i++){
                    $scope.widget.settings.data[$index + i] = new Object();
                    $scope.widget.settings.data[$index + i].type = "data";
                    $scope.widget.settings.data[$index + i].value = grpkey + '.' + idList[i];
                }

                arrow.style.color = "#b3b3b3";
                if ($window.innerWidth >= 1400){
                    if($scope.lock.lockLeft !== false){
                        $scope.lock.lockLeft = !$scope.lock.lockLeft;
                        dashboardService.setLeftLock($scope.lock.lockLeft);
                    }
                }
            } else {
                arrow.style.color = "#07D1EA";
                $window.alert("Please select group(not ID) from Data Menu");
            }
        } else {
            arrow.style.color = "#07D1EA";
            $window.alert("Data not set. Please select from Data Menu");
        }
    }

    //Function to add row above the current row
    $scope.addRowAbove = function($index){
        if($scope.table.rows.length < 80){
            $scope.table.rows.splice($index,0,{contents :[{"datavalue":"","headervalue":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedId","active": "false"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedName","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedAlow","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedWlow","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedValue","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedWhigh","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedAhigh","active": "false"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedUnits","active": "false"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedNotes","active": "false"}], disabled:false });
            $scope.widget.settings.data.splice($index, 0, {}); 
        }else {
            $window.alert("You have reached the maximum limit for rows!");
        }
       
    }

    //Function to add below the current row
    $scope.addRowBelow = function($index){
        if($scope.table.rows.length < 80){
           $scope.table.rows.splice($index+1,0,{contents :[{"datavalue":"","headervalue":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedId","active": "false"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedName","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedAlow","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedWlow","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedValue","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedWhigh","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedAhigh","active": "false"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedUnits","active": "false"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedNotes","active": "false"}], disabled:false });  
            $scope.widget.settings.data.splice($index+1, 0, {}); 
       }else {
            $window.alert("You have reached the maximum limit for rows!");
       }
       
    }

    //Function to delete the current row.
    $scope.deleteRow = function($index){
        if(($index === 0) && ($scope.table.rows.length) === 1){
            $window.alert("Please do not delete this row!Add row above to delete this row.");
        }else {
            $scope.table.rows.splice($index, 1);
            $scope.widget.settings.data.splice($index,1);
        }
    }

    //Function to move row above.
    $scope.moveRowUp = function($index){
        if($index > 0){
            $scope.table.rows[$index-1] = $scope.table.rows.splice($index, 1, $scope.table.rows[$index-1])[0];
            $scope.widget.settings.data[$index-1] = $scope.widget.settings.data.splice($index, 1, $scope.widget.settings.data[$index-1])[0];
            $scope.table.rows[$index-1].colorin = roweffect;
            $timeout(function() {
                $scope.table.rows[$index-1].colorin = '';
            }, 500);
        }
        else{
            $window.alert("This row cannot be moved further up!");
        }
    }

    //Function to move row down.
    $scope.moveRowDown = function($index){
        if(($index) < (($scope.table.rows.length)-1)){
            $scope.table.rows[$index+1] = $scope.table.rows.splice($index, 1, $scope.table.rows[$index+1])[0];
            $scope.widget.settings.data[$index+1] = $scope.widget.settings.data.splice($index, 1, $scope.widget.settings.data[$index+1])[0];
            $scope.table.rows[$index+1].colorin = roweffect;  
            $timeout(function() {
                $scope.table.rows[$index+1].colorin = '';
            }, 500);  
        }
        else{
            $window.alert("This row cannot be moved further down!You have reached the end of the table.");
        }
    }

    //Function to convert a row to a header
    $scope.convertHeader = function($index, header){
        if(header){
            data = header.data
        } else {
            data = "";
        }
        $scope.table.rows[$index] = {contents:[{"datavalue":"","headervalue":{"data": data },"checked":"false","style":"text-align:right;background-color:#1072A4;","colshow":"true","colspan":"9","class":"header","placeholder":"Click here to edit", "active":"true"}], disabled: true};
        $scope.widget.settings.data[$index] = new Object();
        $scope.widget.settings.data[$index].type = "header";
        $scope.widget.settings.data[$index].value = $scope.table.rows[$index].contents[0].headervalue;
    } 

    //Table row and column structure
    checkForRowData();

    function checkForRowData(){
        $scope.table = { 
            "rows" : tableCols 
        };

        if($scope.widget.settings.data.length != 0){
            for (var i=0; i<$scope.widget.settings.data.length; i++){
                if($scope.widget.settings.data[i].type == "header") {
                    $scope.convertHeader(i, $scope.widget.settings.data[i].value);
                }
            }
        }
    } 

    $scope.updateRow = function() {
        for (var i=0; i<$scope.table.rows.length; i++){
            var tempRow = $scope.table.rows[i];
            var data = $scope.widget.settings.data[i];
            if(data) {
                //update values if the row type is data, not header
                if(data.type == "data"){
                    var key = data.value;
                    try {
                        //id is the last/leaf node of the dot separated key.
                        var id = key.split('.').slice(-1)[0];

                        var currentData = dashboardService.getData(key);
                        if(currentData) {
                            var valType = typeof currentData.value;
                            if(valType === "number"){
                                currentData.value = parseFloat(currentData.value.toFixed(4));
                            }

                            tempRow.contents[0].datavalue = id;
                            tempRow.contents[1].datavalue = currentData.name;

                            if(currentData.alarm_low){
                                tempRow.contents[2].datavalue = currentData.alarm_low;
                            }else {
                                tempRow.contents[2].datavalue = 'N/A';   
                            }

                            if(currentData.warn_low){
                                tempRow.contents[3].datavalue = currentData.warn_low;
                            }else {
                                tempRow.contents[3].datavalue = 'N/A';   
                            }

                            tempRow.contents[4].datavalue = currentData.value;
                            if(tempvalue[i] === currentData.value){
                                //stale data
                                if(dServiceObjVal.sIcon === "green" && dServiceObjVal.gIcon === "green" && 
                                    dServiceObjVal.pIcon === "green" && dServiceObjVal.dIcon === "green" ){
                                        tempRow.contents[4].datacolor = colorHealthy;
                                } else {
                                    tempRow.contents[4].datacolor = colorStale;
                                }
                            } else {
                                //new data
                                var colorVal = datastatesService.getDataColor(currentData.alarm_low, currentData.alarm_high,
                                                    currentData.value, currentData.warn_low, currentData.warn_high, valType)
                                if(colorVal === "red"){
                                    tempRow.contents[4].datacolor = colorAlarm;  
                                }else if(colorVal === "orange"){
                                    tempRow.contents[4].datacolor = colorCaution;
                                }else{
                                    tempRow.contents[4].datacolor = colorHealthy;
                                }
                                tempvalue[i] = currentData.value;
                            } 

                            if(currentData.warn_high){
                                tempRow.contents[5].datavalue = currentData.warn_high;
                            }else {
                                tempRow.contents[5].datavalue = 'N/A';   
                            }

                            if(currentData.alarm_high){
                                tempRow.contents[6].datavalue = currentData.alarm_high;
                            }else {
                                tempRow.contents[6].datavalue = 'N/A';   
                            }

                            tempRow.contents[7].datavalue = currentData.units;

                            if(currentData.notes !== ''){
                                tempRow.contents[8].datavalue = currentData.notes;
                            }else {
                                tempRow.contents[8].datavalue = 'N/A';    
                            }
                        }
                    } catch(err){

                    }
                }
            } else {
                if(dServiceObjVal.dIcon === "red"){
                    //GUI Disconnected with Database 
                    tempRow.contents[0].datacolor = colorDisconnected;
                    tempRow.contents[1].datacolor = colorDisconnected;
                    tempRow.contents[2].datacolor = colorDisconnected;
                    tempRow.contents[3].datacolor = colorDisconnected;
                    tempRow.contents[4].datacolor = colorDisconnected;
                    tempRow.contents[5].datacolor = colorDisconnected;
                    tempRow.contents[6].datacolor = colorDisconnected;
                    tempRow.contents[7].datacolor = colorDisconnected;
                    tempRow.contents[8].datacolor = colorDisconnected; 
                }
            }
        }
    }

    $scope.interval = $interval($scope.updateRow, 1000, 0, false);

    $scope.$on("$destroy", 
        function(event) {
            $interval.cancel( $scope.interval );
        }
    );

});



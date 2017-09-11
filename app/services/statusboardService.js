app
.factory('statusboardService',['gridService','dashboardService','datastatesService', function(gridService,dashboardService,datastatesService) { 

    var alarmpanel = {
        statustable : []
    };

    //colors for master alarm and sub system buttons
    var colorValues = {
        alarmcolor : {background:'#FF0000'},
        cautioncolor : {background:'#FFFF00'},
        stalecolor : {background:'#71A5BC'},
        healthycolor : {background:'#12C700'},
        inactivecolor :{color:'#CFCFD5'},
        defaultcolor :{background:'#000000'},
        activecolor:{color:'#000000'}

    };

    var masterAlarmColors = [];

    var masteralarmstatus = {
        colorclasses : [],
        checkedstatus : []
    }
    var mission = dashboardService.getCurrentMission();

    //set the alerts for the alerts board from the database
    function loadAlerts(){
        gridService.loadAlerts().then(function(response) {
            if(response.data.length > 0){
                var uniquetemparray = uniqBy(response.data,JSON.stringify);
                var byDate = uniquetemparray.slice(0);

                //Sort the array keeping the latest alerts to the first
                byDate.sort(function(a,b) {
                    return b.timestamp - a.timestamp;
                });


                for(var k=0;k<masterAlarmColors.length;k++){
                    for(var j=0;j<byDate.length;j++){
                        if(masterAlarmColors[k].vehicle === byDate[j].vehicle && masterAlarmColors[k].color === colorValues.healthycolor){
                            //code to disable the row
                            byDate[j].rowstyle = colorValues.inactivecolor;
                        }else {
                           //byDate[j].rowstyle = colorValues.activecolor; 
                        }
                    }
                }

                alarmpanel.statustable = byDate;
            }else {
                alarmpanel.statustable = [];
            }
        }).catch(function(error){
        });
    }

    //Get the alerts for the alerts board
    function getStatusTable(){
        return alarmpanel;
    }

    //Function to return the color of high priority
    function getHighPriorityColor(colorArray){
        var redCount = 0;
        var yellowCount = 0;
        var greenCount = 0;
        var colors = datastatesService.colorBoundObj;

        redCount = countInArray(colorArray,colors.alarm.color);
        yellowCount = countInArray(colorArray,colors.caution.color);
        greenCount = countInArray(colorArray,colors.healthy.color);

        if(redCount >= 1){
            return colorValues.alarmcolor;
        }else if(redCount === 0 && yellowCount >=1){
            return colorValues.cautioncolor;
        }else if(redCount === 0 && yellowCount === 0){
            return colorValues.healthycolor;
        }
    }

    //Function to set sub system colors
    function setSubSystemColors(contents){
        //1.get vehicles
        //2.for each vehicle get sub systems
        //3.for each sub system get sub category colors and then get the high priority color among them.
        //4.setMasterAlarmColor
        for(var i=0;i<contents.length;i++){
            for(var j=0;j<contents[i].categories.length;j++){
               contents[i].categoryColors[j] = getHighPriorityColor(contents[i].subCategoryColors);
            } 
        }
        setMasterAlarmColor(contents);
    }

    //Function to set Master Alarm colors
    function setMasterAlarmColor(contents){
        masterAlarmColors = [];
        for(var i=0;i<contents.length;i++){
            var subSystemColors = [];
            masteralarmstatus.colorclasses[i] = "";

            for(var j=0;j<contents[i].categoryColors.length;j++){
                subSystemColors.push(contents[i].categoryColors[j].background);
                var color = getHighPriorityColor(subSystemColors);
                contents[i].vehicleColor = color;
                masterAlarmColors.push({"vehicle":contents[i].vehicle,"color":color});
                setGlowingEffect(contents[i].vehicleColor,i,contents[i].vehicle,contents);
            }
        }        
    }

    function setGlowingEffect(color,i,vehicle,contents){
        //check vehiclecolors status from db and set
        gridService.loadVehicleColors().then(function(response) {
            if(response.data.length > 0){

                if(color.background === "#FF0000"){
                    masteralarmstatus.checkedstatus[i] = false; 
                    if(response.data[i].status === true){
                        contents[i].ackStatus = true;
                        masteralarmstatus.colorclasses[i] = "buttonNone";   
                    }else{
                        masteralarmstatus.colorclasses[i] = "buttonred";
                    }
                }else if(color.background === "#FFFF00"){
                    masteralarmstatus.checkedstatus[i] = false;
                    if(response.data[i].status === true) {
                         contents[i].ackStatus = true;
                        masteralarmstatus.colorclasses[i] = "buttonNone";
                    }else {
                        masteralarmstatus.colorclasses[i] = "buttonyellow";
                    }           
                }else {
                    masteralarmstatus.colorclasses[i] = "buttonNone";
                    masteralarmstatus.checkedstatus[i] = true;  
                }
            }
        }).catch(function(error){
        });
    }

    function getMasterAlarmColors(){
        return masteralarmstatus;
    }

    function countInArray(array, what) {
        var count = 0;
        for (var i = 0; i < array.length; i++) {
            if (array[i] === what) {
                count++;
            }
        }
        return count;
    }

    function uniqBy(a, key) {
        var seen = {};
        return a.filter(function(item) {
            var k = key(item);
            return seen.hasOwnProperty(k) ? false : (seen[k] = true);
        })
    }

	return {
        alarmpanel : alarmpanel,
        getStatusTable : getStatusTable,
        getHighPriorityColor : getHighPriorityColor,
        setSubSystemColors : setSubSystemColors,
        getMasterAlarmColors : getMasterAlarmColors,
        loadAlerts : loadAlerts,
        uniqBy : uniqBy
	}
}]);

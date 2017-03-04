app
.directive('linesettings', function() { 
  	return { 
    	restrict: 'EA', 
		templateUrl: './directives/lineplot/linesettings.html',
		controller: 'lineController',
		link: function(scope, element, attributes) {

		}
	}
});	

app.controller('lineController', ['$scope', 'lineService', '$interval', 'd3Service',function($scope, lineService, $interval, d3){

	var vm = this;

	vm.telemetry = lineService.telemetry;
	vm.g = lineService.elem;

	var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S.%L%Z");
	var plotData = [];
	var delay = 1000;	// [milisecond]
	var ptNum = 100;	// Number of points in a plot
	var xUnits;			
	var vehicle = "Audacy2";
	var paramY = "y";
	var paramX = "timestamp";
	var rectHeight = 10;
	var rectWidth = 10;
	var margin = {top: 10, right: 30, bottom: 30, left: 30};

	//
	var jsonData = '{"rows":{"data":[[{"value":"","checked":"true","style":"text-align:left"},{"value":"","checked":"true","style":"text-align:left"},{"value":"","checked":"true","style":"text-align:left"}]]}}';
	$scope.table = JSON.parse(jsonData);

	$scope.addRowAbove = function($index){
		$scope.table.rows.data.splice($index,0,[{"value":"","checked":"true","style":"text-align:left"},{"value":"","checked":"true","style":"text-align:left"},{"value":"","checked":"true","style":"text-align:right"}]);
	}

	$scope.addRowBelow = function($index){
		$scope.table.rows.data.splice($index+1,0,[{"value":"","checked":"true","style":"text-align:left"},{"value":"","checked":"true","style":"text-align:left"},{"value":"","checked":"true","style":"text-align:right"}]);
	}

	$scope.deleteRow = function($index){
		$scope.table.rows.data.splice($index, 1);
	}

	$scope.moveRowUp = function($index){
		$scope.table.rows.data[$index-1] = $scope.table.rows.data.splice($index, 1, $scope.table.rows.data[$index-1])[0];
	}

	$scope.moveRowDown = function($index){
		$scope.table.rows.data[$index+1] = $scope.table.rows.data.splice($index, 1, $scope.table.rows.data[$index+1])[0];
	}

			
	//
	
	// Stream
	$scope.stream = function(){
		vm.stream = $interval(updatePlot, delay);		
	}	

	// Pause
	$scope.pause = function(){
		$interval.cancel(vm.stream);
		plotData=[];
	}
	
	// Close
	$scope.closeWidget = function(widget){
		widget.main = true;
		widget.settings = false;
	}
	
	// Save
	$scope.saveWidget = function(widget){
		widget.main = true;
		widget.settings = false;
	}
	
	// Home
	$scope.goHome = function(){
		alert("HOME")
	}
			
	function updatePlot() {
				
		transHeight = lineService.transHeight;
		transWidth = lineService.transWidth;				
		vm.g.selectAll("g.axis").remove();
		vm.g.selectAll("path").remove();
		vm.g.selectAll("line").remove();
		vm.g.selectAll("circle").remove();
		vm.g.selectAll("text").remove();
				
		var tTemp = parseTime(vm.telemetry[vehicle][paramX].value);
		var xTemp = vm.telemetry[vehicle][paramY].value;
		xUnits = vm.telemetry[vehicle][paramY].units;

		plotData.push({x:tTemp, y:xTemp});
				
		if (plotData.length > ptNum) {
				plotData.splice(0,1);
		};

		data = plotData;
				
		var x = d3.scaleTime()
				.domain(d3.extent(data, function(d) { return d.x; }))
				.rangeRound([margin.left, transWidth+margin.left]);
		var y = d3.scaleLinear()
				.domain(d3.extent(data, function(d) { return d.y; }))
				.rangeRound([transHeight, 0]);
		var line = d3.line()
					.x(function(d) { return x(d.x); })
					.y(function(d) { return y(d.y); });		
		var xMap = function(d) { return x(d.x);};
		var yMap = function(d) { return y(d.y);} 
				
		vm.g.append("g")
				.attr("transform", "translate("+margin.left+",0)")
				.attr("class", "axis")
				.call(d3.axisLeft(y).tickSize(-transWidth));

		// text label for the y axis
		vm.g.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", -10 )
			.attr("x",0 - (transHeight / 2))
			.attr("class", "linelabel")
			.text(paramY+ " [" + xUnits + "]");  
	  
		vm.g.append("g")
			.attr("transform", "translate(0,"+ transHeight + ")")
			.attr("class", "axis")
			.call(d3.axisBottom(x).tickSize(-transHeight));		
					
		// text label for the x axis
		vm.g.append("text")             
			.attr("transform","translate(" + (transWidth/2) + " ," + (transHeight+margin.bottom) + ")")
			.attr("class","linelabel")
			.text(paramX);
	  
		vm.g.selectAll("path")
			.attr("opacity", 0.1);
			
		vm.g.selectAll("line")
			.attr("opacity", 0.1);

		vm.g.append("path")
			.datum(data)
			.attr("class","lineplot")
			.attr("stroke", "#172168")
			.attr("d", line);	

		vm.g.selectAll("dot")
			.data(data)
			.enter().append("circle")
			.attr("r", 2)
			.attr("cx", xMap)
			.attr("cy", yMap)
			.attr("stroke", "#172168")
			.attr("fill", "#172168");		
			
		vm.g.append("rect")
			.attr("transform","translate(" + (margin.left+10) + " ,10)")
			.attr("height", rectHeight)
			.attr("width", rectWidth)
			.style("fill","#172168");
				
		vm.g.append("text")
			.attr("transform","translate(" + (margin.left+20+rectWidth) + " ,"+ (margin.top+10) +")")
			.attr("class","linelabel")
			.text(vehicle);				
				
		return this;
	};
				
}]);
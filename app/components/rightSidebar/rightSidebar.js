app
.component('rightSidebar', {
  	templateUrl: "./components/rightSidebar/right_sidebar.html",
  	controller: function(gridService, dashboardService, prompt, $window, $mdSidenav, ModalService) {
        var vm = this;
  		vm.name = dashboardService.name;
        vm.email = dashboardService.email;
        var dashboard = gridService.getDashboard();

        vm.addWidget = function() {
            gridService.addWidget();
        };

        vm.clear = function() {
            gridService.clear();
        };

        vm.addWidgets = function(widget) {
            gridService.addWidgets(widget);
        };

        vm.widgetDefinitions = gridService.widgetDefinitions;
        vm.QwidgetMenu =  false;
        vm.addMenu = false;
		vm.Doc = false;

        vm.showQwidgetMenu = function(){
            vm.QwidgetMenu = !vm.QwidgetMenu;
        }

        vm.showAddMenu = function(){
            vm.addMenu = !vm.addMenu;
        }

        vm.save = function(){
            prompt({
                title: 'Save Layout',
                input: true,
                label: 'Layout Name',
                value: dashboard["current"].name
            }).then(function(name){
                gridService.save(vm.email, name)
                .then(function(response) {
                    if(response.status == 200){
                        alert("Layout saved succcessfully -- " + name);
                    }
                });
            });
        }

        vm.load = function(){
            gridService.load(vm.email)
            .then(function(response) {
                vm.layouts = response.data;
                vm.layoutMenu = !vm.layoutMenu;
            })
        }

        vm.showLayout = function(layout){
            gridService.showLayout(vm.layouts, layout);
            $window.document.title = "Quindar - " + layout.name;
			closeSidebar();
        }
    	
		vm.showDoc = function(){
            vm.Doc = !vm.Doc;
        }
		
		vm.showReadme = function() {

			// Just provide a template url, a controller and call 'showModal'.
			ModalService.showModal({
				templateUrl: "./components/rightSidebar/documentation.html",
				controller: "docController",
			});
			closeSidebar();
			
		};
		
		vm.showContributing = function() {

			// Just provide a template url, a controller and call 'showModal'.
			ModalService.showModal({
				templateUrl: "./components/rightSidebar/contributing.html",
				controller: "docController",
			});
			closeSidebar();
			
		};
		
		function closeSidebar(){
			if ($window.innerWidth < 1400){
				$mdSidenav('right').close();
            } else {
                var locks = dashboardService.getLock();
                locks.lockRight = !locks.lockRight;
                dashboardService.setRightLock(locks.lockRight); 
            }
		}
		
  
	}
})

app.controller('docController', ['$scope', 'close', function($scope, close) {
	
	$scope.close = function(result) {
		close(result); // close
	};

}]);
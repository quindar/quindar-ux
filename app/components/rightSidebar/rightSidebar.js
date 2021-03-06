app
.component('rightSidebar', {
  	templateUrl: "./components/rightSidebar/right_sidebar.html",
  	controller: function(gridService, dashboardService, prompt, $window, $mdSidenav, userService, $uibModal, $interval) {
        var vm = this;
  		vm.name = userService.getUserName();
        vm.email = userService.getUserEmail();
        var dashboard = gridService.getDashboard();
        getUserRole();

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
        vm.userMenu = false;
        vm.users = [];

        vm.showQwidgetMenu = function(){
            vm.QwidgetMenu = !vm.QwidgetMenu;
        }

        vm.showAddMenu = function(){
            vm.addMenu = !vm.addMenu;
        }

        vm.save = function(ev){
            prompt({
                title: 'Save Layout',
                input: true,
                label: 'Layout Name',
                value: dashboard["current"].name
            }).then(function(name){
                gridService.save(vm.email, name)
                .then(function(response) {
                    if(response.status == 200){
                        $window.document.title = "Quindar - " + name;
                    }
                });
            }).catch(function (err) {});
        }

        vm.load = function(){
            gridService.load(vm.email)
            .then(function(response) {
                vm.layouts = response.data;
                vm.layoutMenu = !vm.layoutMenu;
            },function(err){

            });
        }

        vm.showLayout = function(layout){
            gridService.setGridLoader(true);
            dashboardService.setLoadStatus(false);
            gridService.showLayout(vm.layouts, layout);
            $window.document.title = "Quindar - " + layout.name;
			closeSidebar();
        }
		
		vm.showDoc = function(){
            vm.Doc = !vm.Doc;
		}

		vm.showReadme = function() {

			// Just provide a template url, a controller and call 'open'.
            $uibModal.open({
                templateUrl: "./components/rightSidebar/documentation.html",
                controller: 'docController'
            }).result.then(
            function(response){
                //handle modal close with response
            },
            function () {
                //handle modal dismiss
            });
			closeSidebar();	
		};
		
		vm.showContributing = function() {

			// Just provide a template url, a controller and call 'open'.
            $uibModal.open({
                templateUrl: "./components/rightSidebar/contributing.html",
                controller: 'docController'
            }).result.then(
            function(response){
                //handle modal close with response
            },
            function () {
                //handle modal dismiss
            });
			closeSidebar();		
		};

        vm.showAdminModal = function() {
            closeSidebar();

            $uibModal.open({
                templateUrl: './components/rightSidebar/adminModal.html',
                controller: 'adminCtrl',
                controllerAs: '$ctrl',
                resolve: {
                    mission: function () {
                        return dashboardService.getCurrentMission();
                    }
                }
            }).result.then(
            function(response){
                //handle modal close with response
            },
            function () {
                //handle modal dismiss
            });
        }
		
		function closeSidebar(){
			if ($window.innerWidth <= 1440){
				$mdSidenav('right').close();
            } else {
                var locks = dashboardService.getLock();
                locks.lockRight = !locks.lockRight;
                dashboardService.setRightLock(locks.lockRight); 
            }
		}

        function getUserRole() {
            if ($window.innerWidth <= 768){
                vm.userRole = {
                    cRole : {
                        "name": "Observer",
                        "callsign": "VIP"
                    }
                };
            } else {
                vm.userRole = userService.userRole;
            }
        }

        // toggle the user list menu
        vm.showUsers = function(){
            vm.userMenu = !vm.userMenu;
        }

        // create list of online users
        vm.createUserList = function(){
            var mission = dashboardService.getCurrentMission();
            userService.getOnlineUsers(mission.missionName)
            .then(function(response) {
                if(response.status == 200){
                    vm.users = response.data;
                }
            })
        }

        vm.createUserList();
        // interval to fetch online users every 5 seconds
        vm.interval = $interval(vm.createUserList, 5000);

        // destroy the interval when component is destroyed
        vm.$onDestroy = function () {
            $interval.cancel( vm.interval );
        }
	}
})

app.controller('docController', ['$scope','$uibModalInstance', function($scope,$uibModalInstance) {
	
    $scope.close = function() {
        $uibModalInstance.dismiss('cancel');
    };

}]);

app.controller('adminCtrl', function($scope, $filter, $uibModalInstance, userService, mission, $window) {
    var $ctrl = this;

    $ctrl.users = [];
    $ctrl.roles = [];
    $ctrl.mission = mission.missionName;
    $ctrl.email = userService.getUserEmail();
    $scope.saveSuccess = false;

    userService.getRoles()
    .then(function(response) {
        if(response.status == 200) {
            var roles = response.data.roles;
            for (var role in roles){
                if (!roles.hasOwnProperty(role)) continue;

                roles[role].checked = false;

                $ctrl.roles.push(roles[role]);
            }
        }
    });

    userService.getUsers($ctrl.mission)
    .then(function(response) {
        if(response.status == 200) {
            var users = response.data;
            for (var i=0; i<users.length; i++){
                $ctrl.users.push(users[i]);
            }
        }
    });

    $ctrl.close = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $ctrl.save = function() {
        if($ctrl.selected){
            if(roleChosen()){
                var newRoles = [];
                var objRoles = {};
                 
                for (var i=0; i<$ctrl.roles.length; i++){
                    if($ctrl.roles[i].checked == true) {
                        var newRole = new Object();
                        newRole.name = $ctrl.roles[i].name;
                        newRole.callsign = $ctrl.roles[i].callsign;
                        newRoles.push(newRole);
                        objRoles[$ctrl.roles[i].callsign] = 1;
                    }
                }

                $ctrl.selected.user.allowedRoles = objRoles;

                userService.setAllowedRoles($ctrl.selected.user, newRoles, $ctrl.mission)
                .then(function(response) {
                    if(response.status == 200){
                        $scope.saveSuccess = true;
                        $scope.successMessage = "Success! Roles updated for user: "+ $ctrl.selected.user.google.name;
                    }
                })
            } else {
                $window.alert("Please choose at least one role");
            }
        } else {
            $window.alert("Please select the user from dropdown menu");
        }
    }

    $scope.$watch('$ctrl.selected.user', function(newValue, oldValue){
        for(var i=0; i<$ctrl.roles.length; i++) {
            if($ctrl.selected.user.allowedRoles) {
                if($ctrl.roles[i].callsign in $ctrl.selected.user.allowedRoles){
                    $ctrl.roles[i].checked = true;
                } else {
                     $ctrl.roles[i].checked = false;
                }
            }
        }
    })

    function roleChosen() {
        var trues = $filter("filter")($ctrl.roles, {
            checked: true
        });
        return trues.length;
    }

    $ctrl.resetSuccessMessage = function(){
        $scope.saveSuccess = false;
        $scope.successMessage = "";
    }

});

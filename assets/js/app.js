var todoApp = angular.module('taskApp', []);

todoApp.controller('taskCtrl', ['$scope', 'socket', function($scope, socket){
	
	$scope.taskList = [];

	socket.on('connect', function (data) {
		
		socket.get('/todo', function(data){
			$scope.$apply(function(){
				$scope.taskList = data;
			})
		})
	});

	socket.on('addNew', function(data){
		$scope.$apply(function(){
			$scope.taskList.push(data);
		});
	});


	socket.on('taskDone', function(data){
		$scope.$apply(function(){
			angular.forEach($scope.taskList, function(dt, i){
				if(dt.id == data[0].id){
					$scope.taskList[i] = data[0];
					return;
				}
			});
		});
	});

	$scope.addNewTask = function(){
		var data = $scope.taskName;
		io.socket.post('/todo-add', {task : data}, function (resData, jwres){
			$scope.$apply(function(){
				$scope.taskName = "";
			});
		});
	}

	$scope.taskDone = function(id, e){

		socket.get('/todo/'+id, function(data){

		});
	}

	$scope.isDone = function(id){

		var result = false;

		angular.forEach($scope.taskList, function(dt){
			
			if(dt.id == id){
				if(dt.completed == "yes")
				{
					result =  true;
					return;
				}	
			}
		});

		return result;
	}


}]);



todoApp.factory('socket', function ($rootScope) {
  var socketObj = io.socket;
  return socketObj;
});
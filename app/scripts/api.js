
angular.module('app.services', [])

/**  USAGE
*  
*  1) Inject the API service to the controller
* 
*  .controller('SomeCtrl', function($scope, API) { ... });
*  
*  2) Call a function
*  
*  API.functionName(parameter1, parameter2).
*  success(function(resp, status, headers, config) {
*    // All OK
*  }).
*  error(function(resp, status, headers, config) {
*    // Network error
*  });
* 
*/
.factory('API', function($http) {

	// This service encapsulates the methods to access the methods on the server

	return {
		login: function(username, password){
			return $http.post("/lib/api.php", {q: "login", username: username, password: password});
		},
		logout: function(){
			return $http.post("/lib/api.php", {q: "logout"});
		},
		signUp: function(username, password){
			return $http.post("/lib/api.php", {q: "signup", username: username, password: password});
		},
		getUser: function(){
			return $http.post("/lib/api.php", {q: "getUser"});
		},
		removeAccount: function(){
			return $http.post("/lib/api.php", {q: "removeAccount"});
		}
	}
})
///////////////////////////////////////////////////////////////////////////////

/**  USAGE
*  
*  1) Inject the DATA service to the controller
* 
*  .controller('SomeCtrl', function($scope, DATA) { ... });
*  
*  2) Store some values
*  
*  DATA.name = "John";
*  DATA.someObject = {value: 1, chars: ['a', 'b', 'c', 'd']};
*  DATA.persist();
*  
*  3) Exit or reload the page
*  
*  4) Access the new values right away from any controller where the sevice is injected
*  
*  alert('Hi ' + DATA.name + ': ' + DATA.someObject.chars.join(', '));
*  
*/
.factory('DATA', function() {
	// This service provides a convenient way to share data between controllers and
	// store it on the localStorage transparently
	var data = {};
	var persist = function(){
		localStorage.appPersistentData = JSON.stringify(data);
	};
	var restore = function(){
		if(localStorage.appPersistentData) {
			data = JSON.parse(localStorage.appPersistentData);
		}
	};
	restore();
	data.persist = persist;
	data.restore = restore;
	return data;
});


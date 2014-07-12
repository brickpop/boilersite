
angular.module('app', ['ngRoute', 'app.services'])

.config(function($routeProvider, $locationProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'views/splash.html',
		controller: 'SplashCtrl'
	})
	.when('/welcome', {
		templateUrl: 'views/welcome.html',
		controller: 'WelcomeCtrl'
	})
	.when('/login', {
		templateUrl: 'views/login.html',
		controller: 'LoginCtrl'
	})
	.when('/signup', {
		templateUrl: 'views/signup.html',
		controller: 'SignUpCtrl'
	})
	.when('/home', {
		templateUrl: 'views/home.html',
		controller: 'HomeCtrl'
	})
	.when('/settings', {
		templateUrl: 'views/settings.html',
		controller: 'SettingsCtrl'
	})
	.otherwise({
		redirectTo:'/'
	});
})
.controller('SplashCtrl', function($scope, API, DATA) {

	// When the web loads, this page is shown by default

	// Route the user to the appropriate section once you receive a response from the server

	// Is the user logged in?
	API.getUser()
	.success(function(resp, status, headers, config) {

		if(status != 200) {
			location.hash = "/welcome";
			return;
		}
		
		if(resp.code === 0) { // Logged in
			if(resp.data) {
				DATA.user = resp.data;
				DATA.persist();

				location.hash = "/home";
			}
			else
				location.hash = "/welcome"; // Err
		}
		else {
			location.hash = "/welcome";
		}
	})
	.error(function(resp, status, headers, config) {
		// Error de servidor o de xarxa
		location.hash = "/welcome";
	});
})
.controller('WelcomeCtrl', function($scope) {

})
.controller('LoginCtrl', function($scope, API, DATA) {

	$scope.username = "";
	$scope.password = "";

	$scope.login = function(){

		if(!$scope.username || !$scope.password) {
			alert("Please, enter your username and password to continue");
			return;
		}

		API.login($scope.username, $scope.password)
		.success(function(resp, status, headers, config){
			
			if(status != 200) {
				alert("Unable to connect to the server. Please, try again in a moment.");
				return;
			}

			// OK
			if(resp.code === 0) { // Registrat
				DATA.user = resp.data;
				DATA.persist();
				location.hash = "/home";

			}
			else if(resp.message) {
				alert(resp.message);
			}
			else {
				alert("There was an issue while connecting to the server. Please, try again in a moment.");
			}
		})
		.error(function(resp, status, headers, config){
			// KO
			alert("There was an issue while connecting to the server. Please, try again in a moment.");
		});
	};
})
.controller('SignUpCtrl', function($scope, API, DATA) {

	$scope.username = "";
	$scope.password = "";
	$scope.accept = false;

	$scope.signup = function(){

		if(!$scope.accept) {
			alert("To continue you must accept the terms and conditions of the service.");
			return;
		}
		if(!/[a-zA-Z][0-9a-zA-Z]{3,20}/.test($scope.nick)) {
			alert("The username must only contain alphanumerical characters.");
			return;
		}

		API.signUp($scope.username, $scope.password)
		.success(function(resp, status, headers, config){
		
			if(status != 200) {
				alert("There was an issue while connecting to the server. Please, try again in a moment.");
				return;
			}

			// OK
			if(resp.code === 0) {
				DATA.user = resp.data;
				DATA.persist(); // Share it with the rest of controllers

				location.hash = "/home";
			}
			else if(resp.message) {
				alert(resp.message);
			}
			else {
				alert("There was an issue while connecting to the server. Please, try again in a moment.");
			}
		})
		.error(function(resp, status, headers, config){
			// KO
			alert("There was an issue while connecting to the server. Please, try again in a moment.");
		});
	};
})
.controller('HomeCtrl', function($scope, API, DATA) {

	if(!DATA.user) {
		location.hash = "/";
		return;
	}
	$scope.user = DATA.user;  // Cached version

	// Get the user (latest version)

	API.getUser()
	.success(function(resp, status, headers, config){
		if(status == 200) {
			$scope.user = resp.data;
			DATA.persist();
		}
		else {
			alert("There was an issue while connecting to the server.");
		}
	})
	.error(function(resp, status, headers, config){
		alert("There was an issue while connecting to the server.");
	});


	$scope.logout = function(){
		API.logout()
		.success(function(resp, status, headers, config){
			if(status == 200) {
				DATA.user = undefined;
				DATA.persist();

				location.hash = "/";
			}
			else {
				alert("There was an issue while connecting to the server.");
			}
		})
		.error(function(resp, status, headers, config){
			alert("There was an issue while connecting to the server.");
		});
	};
})
.controller('SettingsCtrl', function($scope, API, DATA) {

	if(!DATA.user) {
		location.hash = "/";
		return;
	}
	$scope.user = DATA.user;

	$scope.removeAccount = function(){

		if(confirm("Are you sure that you want to remove your account?")) {
			API.removeAccount()
			.success(function(resp, status, headers, config){
				if(status == 200) {
					DATA.user = undefined;
					DATA.persist();

					location.hash = "/";
				}
				else {
					alert("There was an issue while connecting to the server.");
				}
			})
			.error(function(resp, status, headers, config){
				alert("There was an issue while connecting to the server.");
			});
		}
	};
});

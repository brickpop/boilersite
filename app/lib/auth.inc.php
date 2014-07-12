<?php

require_once(__DIR__ . "/common.inc.php");

///////////////////////////////////////////////////////////////////////////////
// SESSION MANAGEMENT

function login($username, $password) {
	global $mdb;

	session_start();

	$user = $mdb->users->findOne(array('username' => $username));
	if(!$user)
		throw new Exception("Your credentials are not valid", 101);

	// WEB SERVICES
	if( md5($password) == $user['password'] ) { 

		$_SESSION['expiration'] = time() + 60*60*24*2; // 4 days
		$_SESSION['username'] = $user['username'];
		
		setResult("OK", 0, $user);
	}
	else
		throw new Exception("Your credentials are not valid", 102);
}

function logout() {
	if(empty($_SESSION)) {
		session_start();
	}
	unset($_SESSION['username']);
	unset($_SESSION['expiration']);
	session_write_close();
}

function loadSession() {
	global $mdb;
	session_start();
	
	// If the user is not logged in, we exit

	if((!isset($_SESSION['username']) || $_SESSION['username'] == "")) {
	  throw new Exception("Please, log in to continue", 111);
	}

	if (!isset($_SESSION["expiration"])) { // No sabem qui és
		throw new Exception("Please, log in to continue", 111);
	}

	if($_SESSION['expiration'] <= time()) {
		throw new Exception("Please, log in to continue", 111);
	}
}

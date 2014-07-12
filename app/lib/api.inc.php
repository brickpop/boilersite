<?php

require_once(__DIR__ . "/../priv/config.inc.php");
require_once(__DIR__ . "/common.inc.php");
require_once(__DIR__ . "/auth.inc.php");

// require_once(__DIR__ . "/nusoap/nusoap.php");
// require_once(__DIR__ . "/rest.inc.php");


///////////////////////////////////////////////////////////////////////////////
// ACCOUNT MANAGEMENT

function signUp($username, $password) {
	global $mdb;

	// Check Input
	if(!isAlpha(stripAccents($username))) 
	    throw new Exception("The username must only contain alphanumerical characters", 1001);

	if($mdb->users->count(array('username' => $username)) != 0) {
		throw new Exception("The username you entered is not available", 1002);
	}

	$newUser = array(
		'username' => $username,
		'password' => md5($password),
		'created' => new MongoDate()
	);

	// Add the user to the database
	$mdb->users->insert($newUser);

	login($username, $password);
}

function getUser() {
	global $mdb;

	$user = $mdb->users->findOne(array('username' => $_SESSION['username']));

	if($user) {
		unset($user['_id']);
		unset($user['password']);
		setResult("OK", 0, $user);
	}
	else
		throw new Exception("There was a problem accessing your account on the server", 1001);
}

function removeAccount() {
	global $mdb;

	$user = $mdb->users->findOne(array('username' => $_SESSION['username']));

	if(!$user)
		throw new Exception("There was a problem accessing your account on the server", 1001);

	$r = $mdb->users->remove(array('_id' => $user['_id']), array('username' => $_SESSION['username']));

	if (isset($r['err']) && $r['err'])
	  throw new Exception("There was a problem while trying to remove your account on the server", 1002);

	logout();
}


<?php

require_once(__DIR__ . '/auth.inc.php');
require_once(__DIR__ . '/api.inc.php');

///////////////////////////////////////////////////////////////////////////////
// MAIN ROUTNE

$h = fopen("php://input", "r");
$X = stream_get_contents($h);
$J = json_decode($X, true);

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS' || empty($J) || !isset($J['q'])) {
  exit(0);
}

try
{  
  initApp();

  switch($J['q'])
  {
    case "login":
      login($J['username'], $J['password']);
      break;

    case "logout":
      logout();
      break;

    case "signup":
      signUp($J['username'], $J['password']);
      break;

    case "getUser":
      loadSession();
      getUser();
      break;

    case "removeAccount":
      loadSession();
      removeAccount();
      break;

    // YOUR CALLS HERE

    default:
    	throw new Exception("Invalid query", 101);
  }
  
  showResult();
}
catch (Exception $E) {
  try {
    global $mdb;

    $mdb->exceptions->insert(array("type" => "API", 
                                   "message" => "$E", 
                                   "created" => new MongoDate(), 
                                   "referer" => $_SERVER['HTTP_REFERER'], 
                                   "ip" => $_SERVER['REMOTE_ADDR'], 
                                   "uri" => $_SERVER['REQUEST_URI'], 
                                   "object" => $J));
  }
  catch (Exception $e) { }
  showResult($E->getMessage(), $E->getCode());
}

<?php

require_once(__DIR__ . "/../priv/config.inc.php");

///////////////////////////////////////////////////////////////////////////////
// APP INIT

function initApp() {
	global $mdb, $initMade, $MONGODB_HOST, $MONGODB_PORT, $MONGODB_DATABASE, $MONGODB_USER, $MONGODB_PASSWORD;

   if($initMade === TRUE)
      return;
   else
      $initMade = TRUE;

  // SET UP THE DATABASE, etc.

	// MONGO DB
  if (isset($MONGODB_HOST)) {
    if(isset($MONGODB_USER) && isset($MONGODB_PASSWORD)) {
      $m = new MongoClient( "mongodb://$MONGODB_USER:$MONGODB_PASSWORD@$MONGODB_HOST:$MONGODB_PORT" );
      $mdb = $m->$MONGODB_DATABASE;
    }
    else {
      $m = new MongoClient( "mongodb://$MONGODB_HOST:$MONGODB_PORT" );
      $mdb = $m->$MONGODB_DATABASE;
    }
  }
}

///////////////////////////////////////////////////////////////////////////////
// JSON RESULT HANDLING

global $currentRequestDataSent;
global $currentRequestResult;
$currentRequestDataSent = false;
$currentRequestResult = array("code" => 0, "message" => "OK", "data" => array());

date_default_timezone_set('UTC');

function dumpJSON($data) {
   global $currentRequestDataSent;
   header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
   header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past
   header("Content-type: application/json; charset=utf-8");
   echo json_encode($data);
   $currentRequestDataSent = true;
}

function skipResult() {
  $currentRequestDataSent = true;
}

function setResult($txt, $num, $dat = null) {
   global $currentRequestResult;

   if ($txt != "OK" && $num != 0) {
      if ($currentRequestResult['message'] == "OK")
         $currentRequestResult['message'] = $txt;
      else
         $currentRequestResult['message'] .= "\n\n" . $txt;

      $currentRequestResult['code'] = intval($num);
   }

   if ($dat != null)
      $currentRequestResult['data'] = $dat;
}

function showResult($msg = null, $num = null, $data = null) {
   global $currentRequestResult, $currentRequestDataSent;

   if ($msg == null && $num == null) {
      if (!$currentRequestDataSent) {
         header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
         header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past
         header("Content-type: application/json; charset=utf-8");

         echo json_encode($currentRequestResult);
      }
   }
   else {
      if (!$currentRequestDataSent) {
         header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
         header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past
         header("Content-type: application/json; charset=utf-8");
      }
      else
         trigger_error("WARNING:  S'ha cridat showResult amb dades despres d'haver-ne escrit previament");

      if ($data == null)
         echo json_encode(array(
            "code" => intval($num),
            "message" => $msg)
      );
      else
         echo json_encode(array(
            "code" => intval($num),
            "message" => $msg,
            "data" => $data)
      );
   }
   $currentRequestDataSent = true;
}

///////////////////////////////////////////////////////////////////////////////
// ENCODING


define("LATIN1_UC_CHARS", "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝ");
define("LATIN1_LC_CHARS", "àáâãäåæçèéêëìíîïðñòóôõöøùúûüý");

function utf8Uppercase ($str) {
    $str = strtoupper(strtr($str, LATIN1_LC_CHARS, LATIN1_UC_CHARS));
    return strtr($str, array("ß" => "SS"));
}

function stripAccents($str) {
    $value = strtr(utf8_decode($str), 
                 utf8_decode('àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ'),
                             'aaaaaceeeeiiiinooooouuuuyyAAAAACEEEEIIIINOOOOOUUUUY');

    return utf8_encode($value);
}

function isAlpha($str) {
  $reg = "#[^\p{L}\s-]#u";
  $count = preg_match($reg, $str, $matches);
  return $count == 0;
}


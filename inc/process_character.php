<?php


include_once 'dbinfo.php';
$con = new mysqli($host, $user, $pass, $dbName);
include_once 'functions.php';
include_once 'db_rohipb.php';

if(isset($_POST["LoadingCharacter"])){

  $QueryStr = "SELECT * FROM rohworkingcharacter WHERE CharName = '{$_POST["LoadingCharacter"]}' LIMIT 1";
  $QueryResults = $con->query($QueryStr);
  while ($QueryRow = $QueryResults->fetch_array()){
    if (empty($QueryRow)) {
      $errorstr["message"] = "false";
      $errorstr["reason"] =  "results failed";
      echo json_encode($errorstr);
    } else {
      $QueryRow["PostCount"] = DrawIPBFields("posts", $_POST["LoadingCharacter"], $QueryRow, $roh);
      echo json_encode($QueryRow);
    }
    break;
  }

} else {
  $errorstr["message"] = "false";
  $errorstr["reason"] =  "You dun goofed";
  echo json_encode($errorstr);
}

$con->close();
$roh->close();
unset($con);
unset($roh);


?>

<?php
include_once('dbinfo.php');
include_once('functions.php');

if(isset($_POST["ReadCharacter"])){
   $IncomingCharacter = $_POST["ReadCharacter"];
  $fields = "";
  $values = "";
  $valtype = "";
  $valcount = "";

  foreach($IncomingCharacter as $key => $item){
    $fields .= $key.",";
    if(is_numeric($item)){
      $values.= $item.",";
    } else {
      $values.= "'".$item."',";
    }
  }


  $queryStr = "INSERT INTO rohworkingcharacter (".substr($fields,0,-1).") VALUES (".substr($values,0,-1).")";
  $queryStr2 = "INSERT INTO rohcharacter (".substr($fields,0,-1).") VALUES (".substr($values,0,-1).")";

  $BaseDBresults = $con->query($queryStr2);
  $WorkingDBResults = $con->query($queryStr);
  $usermsg["success"] = "true";
  $usermsg["msg"] = "SUCCESS";
} else {
  $usermsg["success"] = "false";
  $usermsg["msg"] = "Incorrect Call";
}

echo json_encode($usermsg);
?>

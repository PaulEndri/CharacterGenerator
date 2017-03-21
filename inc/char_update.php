<?php

include_once('dbinfo.php');
include_once('functions.php');

if(isset($_POST["UpdatingCharacter"]) && isset($_POST["CharName"])){
  $IncomingCharacter = $_POST["UpdatingCharacter"];
  $QueryStr = "UPDATE rohworkingcharacter SET ";
  foreach($IncomingCharacter as $key => $item){
    if(is_numeric($item)){
      $QueryStr.= $key."=".$item.",";
    } else {
      $QueryStr.= $key."='".$item."',";
    }
  }
  $Query = substr($QueryStr,0,-1)." Where CharName = '".$_POST["CharName"]."'";
  echo ($Query);

  $Results = $con->query($Query);
  echo ($Results);
}

?>

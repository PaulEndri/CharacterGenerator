<?php
//$host = "";
//$user = "";
//$pass = "";
//$dbName = "";
//$tableName = "";

$con = new mysqli($host, $user, $pass, $dbName);
if (mysqli_connect_errno()) {
  printf("Connect failed: %s\n", mysqli_connect_error());
  exit();
}
?>

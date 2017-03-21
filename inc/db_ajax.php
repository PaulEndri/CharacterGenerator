<?php
include 'dbinfo.php';

$QueryBase = "SELECT * FROM ";

$Skills = [];
$Stats = [];
$Perks = [];
$Flaws = [];
$Races = [];

$skills_ret = $con->query("SELECT * FROM skills");
while ($row = $skills_ret->fetch_assoc()) {
  $Skills[$row["name"]] = $row;
}

$stats_ret = $con->query($QueryBase . "stats");
while ($row = $stats_ret->fetch_assoc()) {
  $Stats[$row["name"]] = $row;
}

$perks_ret = $con->query($QueryBase . "perks");
while ($row = $perks_ret->fetch_assoc()) {
  $Perks[$row["name"]] = $row;
}

$flaws_ret = $con->query($QueryBase . "flaws");
while ($row = $flaws_ret->fetch_assoc()) {
  $Flaws[$row["name"]] = $row;
}

$races_ret = $con->query($QueryBase . "races");
while ($row = $races_ret->fetch_assoc()) {
  $Races[$row["name"]] = $row;
}

$DBInfo = array(
          'flaws'			=> $Flaws,
          'perks'			=> $Perks,
          'races'			=> $Races,
          'skills' 		=> $Skills,
          'stats'			=> $Stats
);

if(isset($_POST['gimmefalse'])){
  echo false;
} else {
  echo json_encode($DBInfo);
}

$con->close();

?>

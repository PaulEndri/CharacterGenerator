<?php
include 'inc/dbinfo.php';

$QueryBase = "SELECT * FROM ";

$Skills = [];
$Stats = [];
$Perks = [];
$Flaws = [];
$Races = [];

$skills_ret = $con->query("SELECT * FROM skills");
while ($row = $skills_ret->fetch_assoc()) {
  $Skills[] = $row;
}
unset($skills_ret);

$stats_ret = $con->query($QueryBase . "stats");
while ($row = $stats_ret->fetch_assoc()) {
  $Stats[] = $row;
}
unset($stats_ret);

$perks_ret = $con->query($QueryBase . "perks");
while ($row = $perks_ret->fetch_assoc()) {
  $Perks[] = $row;
}
unset($perks_ret);

$flaws_ret = $con->query($QueryBase . "flaws");
while ($row = $flaws_ret->fetch_assoc()) {
  $Flaws[] = $row;
}
unset($flaws_ret);

$races_ret = $con->query($QueryBase . "races");
while ($row = $races_ret->fetch_assoc()) {
  $Races[] = $row;
}
unset($races_ret);


$con->close();
////////////////////////////////////////////////////////////////////////////////////////////////

//print_r($statlValDB);
//$DBInfo = array( $flawTempDB, $neutralTempFlawDB, $perkTempDB, $raceTempDB, $racialTempPerkDB, $skillTempDB, $skillTempValDB, $statlTempValDB, $statTempDB );
//echo json_encode($DBInfo);

//print_r($DBInfo);



?>

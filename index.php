<?php   session_start(); ?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>RoH CharaGen: Public Beta v2.83</title>
</head>
<link href="css/chargen_base_css.css" rel="stylesheet" type="text/css">

<body onload='CreateShell()')>

<?php

  echo("<div align='center'><div id='MainContainer' align='left'>");
  include_once 'inc/dbinfo.php';
  include_once 'inc/functions.php';

  if (isset($_GET["mode"])) {
    if ($_GET["mode"] == "Logout") {
      DrawGuest();
      include_once 'inc/entry.php';

    } elseif ($_GET["mode"] == "Guest") {
      DrawGuest();
    } elseif ($_GET["mode"] == "Register") {
      DrawGuest();
      include_once 'inc/register.php';
    } elseif ($_GET["mode"] == "LoggedIn") {
      if (isset($_GET["Character"])) {
        DrawCharacter($_GET["Character"]);
      } else {
        echo '<script>alert("Invalid character specified, logging in as Guest.")</script>';
        DrawGuest();
      }
    } elseif ($_GET["mode"] == "Gateway") {
      include_once 'inc/entry.php';
    } elseif ($_GET["mode"] == "NewCharacter" && isset($_GET["Character"])){
      CreateCharacter($_GET["Character"]);
    } else {
      echo ("Failed because GET MODE is equal to " . $_GET["mode"]);
    }
  } else {

    DrawGuest();
    include_once 'inc/entry.php';

  }


  echo("</div></div>");

?>
</body>
<script src="http://code.jquery.com/jquery-1.10.1.min.js"></script>
<script src="js/char_gen_script.js"></script>
<script src="js/mmtrans.js"></script>

</html>

<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>RoH CharaGen: Public Beta v1.17</title>
</head>
<link href="css/chargen_base_css.css" rel="stylesheet" type="text/css">

<body onload="CreateShell()">

<?php

echo("<div align='center'><div id='MainContainer' align='left'>");

include 'inc/dbinfo.php';
include 'inc/functions.php';
include 'inc/db_draw.php';
include 'inc/guest_view.php';


echo("</div></div>");
?>
</body>

<script src="http://code.jquery.com/jquery-1.10.1.min.js"></script>
<script src="js/char_gen_script.js"></script>

</html>

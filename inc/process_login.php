<?php
session_start();

include_once 'dbinfo.php';
include_once 'db_rohipb.php';
include_once 'functions.php';


if (isset($_POST['charname'], $_POST['p'])) {
    $charname = $_POST['charname'];
    $password = $_POST['p']; // The hashed password

    /*if ($charname == "ADMIN" && $password == "8==D~~{}") {
      $msg["success"] = "true";
      $msg["new"] = "mod"
      $msg["message"] = "admin";
      echo json_encode($msg);
    } elseif ($charname == "SCRIBE" && password == "H4x0r3D") {
      $msg["success"] = "true";
      $msg["new"] = "mod"
      $msg["message"] = "admin";
    }*/

    if (login($charname, $password, $roh) == true) {
      $error_msg["login"] = true;
      // create new query to check if character is new or existing
      if($new_stmt = $con->prepare("SELECT id FROM rohworkingcharacter WHERE CharName = ?")){
        $new_stmt->bind_param('s', $charname);
        $new_stmt->execute();
        $new_stmt->store_result();
        // check for character in roh character database;
        if($new_stmt->num_rows > 0){
          $user_msg["success"]=  "true";
          $user_msg["new"]    =  "false";
          $user_msg["message"]=  $charname;
        } else {
          $user_msg["success"]=  "true";
          $user_msg["new"]    =  "true";
          $user_msg["message"]=  "null";
        }

          $_SESSION["CHARACTER"] = $charname;
          echo json_encode($user_msg);
      } else {
        $error_msg["success"] = "fail";
        $error_msg["message"] = "NOPE.AVI";
        $error_msg["login"] = "Kinda true?";
        echo json_encode($error_msg);
      }
    } else {
        $error_msg["success"] = $charname;
        $error_msg["message"] = $password;
        $error_msg["ho"] = login($charname, $password, $roh, true);
        $error_msg["login"] = false;
        echo json_encode($error_msg);
    }
} else {
    header("HTTP/1.0 403 Forbidden");
    print 'Nope';
}

$con->close();
$roh->close();
?>

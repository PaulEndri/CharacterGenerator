<?php

include_once 'db_rohipb.php';


if ($stmt = $roh->prepare("SELECT posts, members_pass_hash, members_pass_salt FROM members WHERE name = ? LIMIT 1")) {
  $stmt->bind_param('s', $charname);  // Bind "$charaname" to parameter.
  $stmt->execute();    // Execute the prepared query.
  $stmt->store_result();

  // get variables from result.
  $stmt->bind_result($posts, $db_hash, $db_Salt);
  $stmt->fetch();

  // hash the password with the unique salt.
  // protective measure to create a remotely secure
  // attempt at connection and security
  $password = md5(md5($db_Salt) . md5($password));
  echo $db_hash;
  echo "<br>".$password;

  if ($stmt->num_rows == 1) {
    // Check if the password in the database matches
    // the password the user submitted.
    if ($db_hash == $password) {
      // Password is correct!
      $user_browser = $_SERVER['HTTP_USER_AGENT'];
      $username = preg_replace("/[^a-zA-Z0-9_\-]+/", "",$username);
      $_SESSION['username'] = $username;
      $_SESSION['rawPass'] = $password;
      $_SESSION['login_string'] = hash('sha512', $password . $username);
      $stmt->close();
      return true;
    } else {
      return false;
    }
  } else {
    // No user exists.
    return false;
  }
}

?>

<?php
function login($charname, $password, $db, $forcefail = false) {
    // Using prepared statements means that SQL injection is not possible.
    if ($stmt = $db->prepare("SELECT posts, members_pass_hash, members_pass_salt FROM members WHERE name = ? LIMIT 1")) {
        $stmt->bind_param('s', $charname);  // Bind "$charaname" to parameter.
        $stmt->execute();    // Execute the prepared query.
        $stmt->store_result();

        // get variables from result.
        $stmt->bind_result($posts, $db_hash, $salt);
        $stmt->fetch();

        // hash the password with the unique salt.
        // protective measure to create a remotely secure
        // attempt at connection and security
        $oldpass = $password;
         $password = md5(md5($salt) . md5($password));

        if ($stmt->num_rows == 1) {
                // Check if the password in the database matches
                // the password the user submitted.
                if ($db_hash == $password) {
                    // Password is correct!
                    $user_browser = $_SERVER['HTTP_USER_AGENT'];
                    $username = preg_replace("/[^a-zA-Z0-9_\-]+/", "",$username);
                    $_SESSION['username'] = $username;
                    $_SESSION['login_string'] = hash('sha512', $username . $_SERVER['REMOTE_ADDR']);
                    $stmt->close();
                    return true;
                } else {
                  if($forcefail)
                    return "hash failed";

                    return false;
                }
        } else {
            if($forcefail)
              return "no user exists";

            return false;

        }
    }
}

function login_check() {
    // Check if all session variables are set
    if (isset($_SESSION['username'], $_SESSION['login_string'])) {

        $login_string = $_SESSION['login_string'];
        $username = $_SESSION['username'];
        $user_local = $_SERVER['REMOTE_ADDR'];
        $login_check = hash('sha512', $username . $user_local);

        if ($login_check == $login_string) {
          // Logged In!!!!
          return true;
        } else {
          // Not logged in
          return false;
        }
    }
}

function esc_url($url) {

    if ('' == $url) {
        return $url;
    }

    $url = preg_replace('|[^a-z0-9-~+_.?#=!&;,/:%@$\|*\'()\\x80-\\xff]|i', '', $url);

    $strip = array('%0d', '%0a', '%0D', '%0A');
    $url = (string) $url;

    $count = 1;
    while ($count) {
        $url = str_replace($strip, '', $url, $count);
    }

    $url = str_replace(';//', '://', $url);

    $url = htmlentities($url);

    $url = str_replace('&amp;', '&#038;', $url);
    $url = str_replace("'", '&#039;', $url);

    if ($url[0] !== '/') {
        // We're only interested in relative links from $_SERVER['PHP_CurrentCharacter']
        return '';
    } else {
        return $url;
    }
}
function DrawGuest(){
  include_once 'inc/db_draw.php';
  include_once 'inc/guest_view.php';
}

function DrawCharacter($LoadedChar){
  include_once 'inc/db_draw.php';
  include_once 'inc/logged_in_view.php';
}
function DrawIPBFields($fields, $char, $ret, $db){
  if ($PostQuery = $db->prepare("SELECT {$fields} FROM members WHERE name = ? LIMIT 1")) {
    $PostQuery->bind_param("s", $char);
    $PostQuery->execute();
    $PostQuery->store_result();
    $PostQuery->bind_result($Posts);
    $PostQuery->fetch();

    if ($PostQuery->num_rows == 1) {

      return $Posts;
    } else {
      $error_msg["message"] = "false";
      $error_msg["reason"] = "IPB Query failed to return results.";
      $error_msg["results"] = $Posts;

      return $error_msg;
    }
  } else {
    $error_msg["message"] = "false";
    $error_msg["reason"] = "IPB query failed to fire";

    return $error_msg;
  };
}
?>

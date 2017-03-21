<?php

  echo(
    "<div id='Cover'>
      <div id='LoginMenu'>
        <form id='UserMenuForm' action='' method='POST' >
          <div id='UserMenuFormPar'>Please use yours realms of hyrule<br> user name and password to login:</p>
          <input id='NameSubmitInput' name='NameSubmitInput' type='text' placeholder='UserName'><br>
          <input id='PasswordSubmitInput' name='PasswordSubmitInput' placeholder='Password'type='password'><br>
          <button id='LoginBtn' type='button' onClick='Enter(1)'>Log in</button>
          <button id='GuestBtn' type='button' onClick='Enter()'>Continue as Guest</button>
        </form>
        <div id='MsgBox'><p id='MsgBoxPar'>&nbsp;</p></div>
        </div>
    </div>"
  );

?>

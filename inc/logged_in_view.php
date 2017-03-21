<?php
session_start();
require_once 'functions.php';
require_once 'db_rohipb.php';
require_once 'dbinfo.php';

$con = new mysqli($host, $user, $pass, $dbName);

if(login_check()){
  $querystr = "SELECT * FROM rohworkingcharacter WHERE CharName = '".$LoadedChar."'";
  $character_values = $con->query($querystr);
  $char_ret = $character_values->fetch_assoc();
  $htmltoprint = "";

  $htmltoprint .= "
    <div id='ButtonMenu'>
      <div id='ExportButton' onclick='CurrentCharacter.Export()'>Generate BBCode</div>
      <div id='UpdateButton' onclick='CurrentCharacter.UpdateCharacter()'>Submit</div>
      <div id='LogoutButton' onclick='Logout()'>Log out</div>;
      <div id='BPLEFT'>{$char_ret["XPLeft"]} points left</div>
    </div>
    <div id='QuickLearnerCover'>
      <div id='QuickLearnerMenu'> 'Please Select Your Quick Learner Bonus:'";
        foreach ($skills as $CurrentATSkills) {
          $htmltoprint .=  "<div id='" . $CurrentATSkills['name'] . "QLChoice' class='ATSkillChoice Unselected' onClick=\"CurrentCharacter.QuickLearn('{$CurrentATSkills["name"]}')\">" . $CurrentATSkills['name'] . "</div>";
        }
      $htmltoprint .= "</div>
    </div>
    <div id='ExportBody' style='display:none;' >[b]Name:[/b]<br>
      [b]Other Aliases:[/b]<br>
      [b]Gender:[/b]<br>
      <div id='RaceExport'>[b]Race:[/b] </div>
      [b]Archetype:[/b] <div id='ATExport'></div>
      <div id='ATStatExport'>[i]+1 [/i]</div>
      <div id='ATSkill0Export'>[i]+2 [/i]</div>
      <div id='ATSkill1Export'>[i]+2 [/i]</div>
      <div id='ATSkill2Export'>[i]+2 [/i]</div>
      [b]Nationality:[/b] <br>

      [b]Health[/b]:<br>
      [b]Defense[/b]:<br>
      [b]Stats[/b][list]<br>";

      foreach($Stats as $StatExport){
        $this_stat = $StatExport["name"];
        $htmltoprint .= "<div id='{$this_stat}Export'>[*]{$this_stat}[/*]</div>";
      }

      $htmltoprint .="[/list][b]Skills[/b][list]<br>";

      foreach($Skills as $SkillExport){
        $this_skill = $SkillExport["name"];
        $htmltoprint .= "<div id='{$this_skill}Export'>[*]{$this_skill}[/*]</div>";
      }

      $htmltoprint .= "[/list]<br>
      <br>
      [b]Perks and Flaws[/b]<br>
      [i]Perks:[/i][list]<br>
      <div id='PerkExport'>&nbsp;</div>
      [/list]<br>
      [i]Flaws:[/i][list]<br>
      <div id='FlawExport'></div>
      [/list]<br>

      [b]Physical Description:[/b]<br>
      [b]Personality:[/b]<br>
      [b]Family:[/b]<br>
      [b]Magical Talents:[/b]<br>
      [b]Weapons and Talents:[/b]<br>
      [b]Strengths and Weaknesses:[/b]<br>
      [b]History:[/b]<br>
      [b]Spells:[/b]<br></div>";

$htmltoprint .= (
  "<div id='ColTwo'>
    <div id='CharNameSpan'>{$char_ret["CharName"]}<br></div>
    <div id='InfoView'>
      Character Race:<br>
      <div id='CharRace' class='Unselected'>{$char_ret["Race"]}</div>
      Archetype Stat:<br>
      <div id='ATStat' class='Unselected'>{$char_ret["ArchetypeStat"]}</div>
      Archetype Skills:<br>
      <div id='ATSkill0' class='Unselected'>{$char_ret["ArchetypeSkill1"]}</div>
      <div id='ATSkill1' class='Unselected'>{$char_ret["ArchetypeSkill2"]}</div>
      <div id='ATSkill2' class='Unselected'>{$char_ret["ArchetypeSkill3"]}</div>
      Post Count:<br>
      <div id='PostCount'><input id='PostCountInput' disabled type='number' value='{$char_ret["PostCount"]}'></input></div>
      Quest XP:<br>
      <div id='QuestXP'><input id='QuestXPInput' type='number' max='20' min ='0' value='{$char_ret["QuestXP"]}'></input></div>"
);
      if ($char_ret["MortalCheck"]) {
        $htmltoprint .= "<div id='MortalCheck'>
          <form id='MortalForm'>
            <input type='radio' disabled name ='MortalCheck' id='YesMortal'>
            <label for='YesMortal' name = 'MortalCheck'>Character is Mortal</label><br>
          </form>
        </div>
        <div id='MortalCutOff'>Post count mortal at: <br>
        <input id='MortalInput' type='number' min='100' disabled value='{$char_ret["MortalThreshold"]}'>
        </input>
        </div>";
      } else {
        $htmltoprint .= "<div id='MortalCheck'>
          <form id='MortalForm'>
            <input type='radio' name = 'MortalCheck' id='YesMortal'>
            <label for='YesMortal' name = 'MortalCheck'>Character is Mortal</label><br>
            <input type='radio' id='NoMortal' name='MortalCheck'>
            <label for='NoMortal' name='MortalCheck' id='NoMortalLbl'>Character is NOT Mortal<label>
          </form>
        </div>
        <div id='MortalCutOff'>Post count mortal at: <br>
          <input id='MortalInput' type='number' min='100'>
          </input>
        </div>";
      }

    $htmltoprint .= "</div>

    <div id='ColOne'>

    </div>
  </div>

  <input type='hidden' id='charsecretinput' value='".$LoadedChar."'>
";

  $htmltoprint .= ("<div id='statskillcont'>");

  $i = 0;
  foreach($Stats as $CurrentStat){
    $this_stat_name = $CurrentStat["name"];
    $this_stat_val = $char_ret[$this_stat_name];

    $htmltoprint .= ( "
      <div id='StatStuff'>
        <div id='{$this_stat_name}Text' class='Stat'>{$CurrentStat["name"]}:</div>
        <div id='{$this_stat_name}Counter' class='Counter'> {$this_stat_val} </div>
        <input type='button' id='{$this_stat_name}PlusButton' class='Plus Button' onClick='CurrentCharacter.Stats[\"{$this_stat_name}\"].add()' value='+'>
        <input type='button' id='{$this_stat_name}MinusButton' class='Minus Button' onClick='CurrentCharacter.Stats[\"{$this_stat_name}\"].subtract()' value='-'>
      </div>
    " );

  }

  foreach($Skills as $CurrentSkill){
    $this_skill_name = $CurrentSkill["name"];
    $this_skill_val = $char_ret[$this_skill_name];

    $htmltoprint .= ( "
      <div id='SkillStuff'>
        <div id='{$this_skill_name}Text' class='Stat'>{$this_skill_name}:</div>
        <div id='{$this_skill_name}Counter' class='Counter'> {$this_skill_val} </div>
        <input type='button' id='{$this_skill_name}PlusButton' class='Plus Button' onClick='CurrentCharacter.Skills[\"{$this_skill_name}\"].add()' value='+' >
        <input type='button' id='{$this_skill_name}MinusButton' class='Minus Button' onClick='CurrentCharacter.Skills[\"{$this_skill_name}\"].subtract()' value='-'>
      </div>
    " );
  }

  $htmltoprint .= ("</div>");

  $htmltoprint .= ("<div id='PerkContainer'>");

  foreach($Perks as $CurrentPerk){
    $AdditionalPerks = "";
    if ($CurrentPerk["isRacialPerk"]) {
      $AdditionalPerks = " RacialPerk";
    }

    if ($char_ret[(string)$CurrentPerk["name"]] == "1") {
      $AdditionalPerks .= " Selected";
    }

    $htmltoprint .= ("
      <div id='".$CurrentPerk['name']."Perk' Class='Perk Unselected". $AdditionalPerks ."' onClick=\"CurrentCharacter.Perks['{$CurrentPerk["name"]}'].toggle()\" title='" . $CurrentPerk['description'] . "'>".$CurrentPerk['name']."</div>
    ");
    $i++;
  };

  $htmltoprint .= ("</div>");

  $htmltoprint .= ( "<div id='FlawContainer'>" );
  $i = 0;

  foreach($Flaws as $CurrentFlaw){
    if ($char_ret[(string)$CurrentFlaw]["name"] === "1") {
      $AdditionalFlaws = " Selected";
    } else {
      $AdditionalFlaws = "";
    }

    $htmltoprint .= ( "
      <div id='".$CurrentFlaw['name']."Flaw' class='Flaw Unselected".$AdditionalFlaws."' onClick=\"CurrentCharacter.Flaws['{$CurrentFlaw["name"]}'].toggle()\" title='" . $CurrentFlaw['description'] . "'>".$CurrentFlaw['name']."</div>
    ");
  }

  echo $htmltoprint;
} else {
  var_dump($_SESSION);
  include_once 'entry.php';
  echo '<script>alert("Invalid session settings, please try again or contact an administrator");</script>';
}
?>

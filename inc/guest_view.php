<?php
$htmltoprint = "";

$htmltoprint .= ( "
  <div id='ButtonMenu'>
    <div id='ExportButton' onclick='CurrentCharacter.Export()'>Generate BBCode</div>
    <div id='SubmitButton' onclick='CurrentCharacter.CreateNewCharacter()'>Submit</div>
    <div id='BPLEFT'></div>
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
    [b]Stats[/b][list]<br>
    <div id='StrengthExport'>[*]Strength:</div>
    <div id='AgilityExport'>[*]Agility: </div>
    <div id='IntelligenceExport'>[*]Intelligence: </div>
    <div id='MagicExport'>[*]Magic: </div>
    <div id='CharismaExport'>[*]Charisma: </div>
    [/list]

    [b]Skills[/b][list]<br>
    <div id='StrikingExport'>[*]Striking: </div>
    <div id='BrawlingExport'>[*]Brawling: </div>
    <div id='EnduranceExport'>[*]Endurance: </div>
    <div id='AthleticsExport'>[*]Athletics: </div>
    <div id='RangedCombatExport'>[*]Ranged Combat:</div>
    <div id='DefensiveCombatExport'>[*]Defensive Combat: </div>
    <div id='SupportExport'>[*]Healing: </div>
    <div id='PuzzlesExport'>[*]Puzzles: </div>
    <div id='SpellsExport'>[*]Spells:</div>
    <div id='CastingExport'>[*]Casting: </div>
    <div id='ArcaneExport'>[*]Arcana: </div>
    <div id='MagicalItemUseExport'>[*]Magical Item Use: </div>
    <div id='SincerityExport'>[*]Sincerity: </div>
    <div id='InspirationExport'>[*]Inspiration: </div>
    <div id='NaturalAffinityExport'>[*]Natural Affinity: </div>
    [/list]<br>
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
    [b]Spells:[/b]<br></div>
    <div id='ColOne' onload=''>
    <div id='RaceChooseLabel'>Choose Your Race:</div>
    <div id='ColOneSectionOne'>
    ");

    foreach($Races as $CurrentRace){
      $htmltoprint .= ("
        <div id='" . $CurrentRace['name'] . "Div' class='Race Unselected' onClick=\"CurrentCharacter.ToggleRace('{$CurrentRace["name"]}')\"> ". $CurrentRace['name'] . "</div>
      " );
    };

    $htmltoprint .= ("
      </div>
        <div id='RaceSubMenu'>&nbsp;</div>
        <div id='RaceSubMenu2'>&nbsp;</div>
      </div>
    ");

    $htmltoprint .=  "<div id='ColTwo'><div id='StatChoice' class='ATChoiceCont'>Choose your Archetype Stat:";

    foreach($Stats as $CurrentATStat){
      $htmltoprint .=  "<div id='".$CurrentATStat['name']."ATChoice' class='ATStatChoice Unselected' onClick=\"CurrentCharacter.Archetype('{$CurrentATStat["name"]}', 0)\">" . $CurrentATStat['name'] . "</div>";
    };
    $htmltoprint .=  "</div><div id='SkillChoice' class='ATChoiceCont'>Choose your Archetype Skills:";
    ;
    foreach($Skills as $CurrentATSkills){
      $htmltoprint .=  "<div id='" . $CurrentATSkills['name'] . "ATChoice' class='ATSkillChoice Unselected' onClick=\"CurrentCharacter.Archetype('{$CurrentATSkills["name"]}', 1)\">" . $CurrentATSkills['name'] . "</div>";
    };

    $htmltoprint .= "</div></div>";

    $htmltoprint .= ("<div id='statskillcont'>");

    foreach($Stats as $CurrentStat){

      $htmltoprint .= ("
        <div id='StatStuff'>
          <div id='" . $CurrentStat["name"] . "Text' class='Stat'>" . $CurrentStat["name"] . ":</div>
          <div id='" . $CurrentStat["name"] . "Counter' class='Counter'> 2 </div>
          <input type='button' id='" . $CurrentStat["name"] . "PlusButton' class='Plus Button' onClick='CurrentCharacter.Stats[\"".$CurrentStat["name"]."\"].add()' value='+'>
          <input type='button' id='" . $CurrentStat["name"] . "MinusButton' class='Minus Button' onClick='CurrentCharacter.Stats[\"".$CurrentStat["name"]."\"].subtract()' value='-'>
        </div>
      ");

    }

    $i = 0;
    foreach($Skills as $CurrentSkill) {
      $htmltoprint .= ("
      <div id='SkillStuff'>
        <div id='" . $CurrentSkill['name'] . "Text' class='Stat'>" . $CurrentSkill["name"] . ":</div>
        <div id='" . $CurrentSkill['name'] . "Counter' class='Counter'> 0 </div>
        <input type='button' id='" . $CurrentSkill['name'] . "PlusButton' class='Plus Button' onClick='CurrentCharacter.Skills[\"".$CurrentSkill["name"]."\"].add()' value='+' >
        <input type='button' id='" . $CurrentSkill['name'] . "MinusButton' class='Minus Button' onClick='CurrentCharacter.Skills[\"".$CurrentSkill["name"]."\"].subtract()' value='-'>
      </div>
      ");
    }
    $htmltoprint .= ("</div>");

    $htmltoprint .= ("<div id='PerkContainer'>");

    foreach($Perks as $CurrentPerk){
      $AdditionalPerks = "";
      if ($CurrentPerk["isRacialPerk"]) {
        $AdditionalPerks = "RacialPerk";
      }

      $htmltoprint .= ("
        <div id='".$CurrentPerk['name']."Perk' Class='Perk Unselected ". $AdditionalPerks ."' onClick=\"CurrentCharacter.Perks['{$CurrentPerk["name"]}'].toggle()\" title='" . $CurrentPerk['description'] . "'>".$CurrentPerk['name']."</div>
      ");
      $i++;
    };

    $htmltoprint .= ("</div>");

    $htmltoprint .= ( "<div id='FlawContainer'>" );

    foreach($Flaws as $CurrentFlaw){
      $htmltoprint .= ( "
        <div id='".$CurrentFlaw['name']."Flaw' class='Flaw Unselected' onClick=\"CurrentCharacter.Flaws['{$CurrentFlaw["name"]}'].toggle()\" title='" . $CurrentFlaw['description'] . "'>".$CurrentFlaw['name']."</div>
      ");
    }


    echo $htmltoprint;
?>

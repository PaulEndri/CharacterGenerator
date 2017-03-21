<?php
	echo "<div id='ColTwo'><div id='StatChoice' class='ATChoiceCont'>Choose your Stat:";
	$i = 0;
	foreach($Stats as $CurrentATStat){
		echo "<div id='".$CurrentATStat['name']."ATChoice' class='ATStatChoice Unselected' onClick=\"CurrentCharacter.Archetype('{$CurrentATStat["name"]}', 0)\">" . $CurrentATStat['name'] . "</div>";
		$i++;
	};
	$hiddenForms .= "<input id='ArchetypeStatSubmit' name='ArchetypeStatSubmit' type='number'><input id='ArchetypeSkill1Submit' name='ArchetypeSkill1Submit' type='number'><input id='ArchetypeSkill2Submit' name='ArchetypeSkill2Submit' type='number'><input id='ArchetypeSkill3Submit' name='ArchetypeSkill3Submit' type='number'>";
	echo "</div><div id='SkillChoice' class='ATChoiceCont'>Choose your Skills:";

	$i=0;
	foreach($Skills as $CurrentATSkills){
		echo "<div id='" . $CurrentATSkills['name'] . "ATChoice' class='ATSkillChoice Unselected' onClick=\"CurrentCharacter.Archetype('{$CurrentATSkills["name"]}', 1)\">" . $CurrentATSkills['name'] . "</div>";
		$i++;
	};

	echo "</div></div>";
?>

var WorkingFlawPoints = 10;
var FlawPoints = 10;
var RoHNameDB = new Array();
var DataBaseIn;
var GimmeInfo;
var CharaGen = true;
var MortalCheck = false;
var CurrentCharacter;

// This is the creation of the Attribute object
// It will be used to create the Skill and Stats Containers
var Attribute = function(t, n, c, i, g) {
  this.name = n;                                        //Name of Attribute
  this.current = c;                                     //Current Value
  this.type = t;                                        //Skill or Stat
  this.govern = g;                                      //Stat governed by skill
  this.ATViewControl = $("#" + this.name + "ATChoice"); //HTML ID of Attribute for Archetype
  this.ViewControl = $("#" + this.name + "Counter");    //HTML ID of Attribute for display
  this.baseVal = 0;                                     //Real value, for recounting purposes
  this.spent = 0;                                       //Active modifcation number
  if (i) {
    this.initial = i;                                   //Initial value if not 0
  } else {
    this.initial = 0;
  }
}
  Attribute.prototype.add = function(isFree) {                //Addition Method for Attributes
    var ModifyingCost = this.current + 1;               //Store future value
    if (this.type == "stat") {
      ModifyingCost *= 5;                               //Accomodate for Stat Cost
    }
    if (CurrentCharacter.ActiveXP - ModifyingCost >= 0) {
      if (this.current + 1 < 5 && CharaGen === true) { //Ensure the increase is valid
        this.current++;                                 //Increase current value
        if (!isFree) {                                    //Check if value is being given freely
          this.spent++;                                 //Increase real value
        }
        CurrentCharacter.ActiveXP -= ModifyingCost;                   //Account for point usage
        this.ViewControl.html(this.current);            //Update view for this Attribute
      } else if (CharaGen == true) {
        alert("You can not go above this value for any attribute at the current time");
      } else {
        if ((this.type == 'stat' && this.current+1<7) || ((this.type == 'skill' && this.current+1<=(CurrentCharacter['Stats'][this.govern].current)*2) && (this.type == 'skill' && this.current+1<=10))) {
          this.current++;
          if (!isFree) {
            this.spent++;
          }
          CurrentCharacter.ActiveXP -= ModifyingCost;
          this.ViewControl.html(this.current);
        } else {
          alert("You can not go above this value for any attribute at the current time");
        }
      }
    };
    CurrentCharacter.UpdateBP();                                         //Update Bonus Points
  };
  Attribute.prototype.subtract = function() {           //Subtraction Method for Attributes
    var ModifyingCost = this.current;                   //Store future value
    if (this.type == "stat") {
      ModifyingCost *= 5;                               //Accomodate for Stat Cost
    }
    if (this.current - 1 >= this.initial) {             //Ensure the decrease is valid
      CurrentCharacter.ActiveXP += ModifyingCost;       //Account for point usage
      this.current--;                                   //Decrease current value
      this.spent--;                                     //Decrease real value
      this.ViewControl.html(this.current);              //Update view for this Attribute
    };
    CurrentCharacter.UpdateBP();                                         //Update Bonus Points
  };
var Race = function(i, n, x, y, p, s) {                    //Race Object for playable Races
    this.name = n;                                      //Race name
    this.index = i;
    this.bonusOne = x;                                  //Race Stat Bonus Option One
    this.bonusTwo = y;                                  //Race Stat Bonus Option Two
    this.racialPerk = p;                                //Race specific perk name (always string)
    this.StatBonus = false;
    this.SkillBonus = false;
    if (s != "NONE") {                                  //Is there a special perk for this race?
      this.SpecialPerk = s;                             //If so, store it.
    };
};
Race.prototype.toggleBonus = function(BonusSelect) {    //Stat Bonus Selection Method for Race Object

  if (this.StatBonus !== false) {                         //If Previous Bonus Exist
    CurrentCharacter.Stats[this.StatBonus].initial -= 1;//Decrease initial value by one to undo the previously selected bonus
    CurrentCharacter.Stats[this.StatBonus].current -= 1;//Decrease current value by one to properly accomodate the real value
  }
  this.StatBonus = 0;                                   //Set StatBonus to an Int
  this.StatBonus = BonusSelect;                         //Set StatBonus to passed value
  CurrentCharacter.Stats[this.StatBonus].initial += 1;  //Increase core value of bosen
//Begin accounting, clean up, and verification methods:
  CurrentCharacter.ResetXP();
  CurrentCharacter.RecountTraits();
  CurrentCharacter.UpdateAttributes();
//End accounting, clean up, and verification methods.
  if (BonusSelect == this.bonusOne) {                     //Update the related views appropriately.
    $("#Race" + this.bonusOne + "StatDiv").addClass("Selected");
    $("#Race" + this.bonusTwo + "StatDiv").removeClass("Selected");
  } else {
    $("#Race" + this.bonusTwo + "StatDiv").addClass("Selected");
    $("#Race" + this.bonusOne + "StatDiv").removeClass("Selected");
  }
};
Race.prototype.skillBonus = function(BonusSelect) {   //Skill bonus selection method for the Race object
  if (CharaGen == true) {
    if (this.SkillBonus) {                                //If a previous value existed, we're going to clean up after it
      $("#RaceSkill6").removeClass("Selected");
      $("#RaceSkill9").removeClass("Selected");
      CurrentCharacter.Skills[this.SkillBonus].initial -= 2;
      CurrentCharacter.Skills[this.SkillBonus].current -= 2;
    }
    this.SkillBonus = BonusSelect;                       //Trigger new skill bonus selection.
    CurrentCharacter.Skills[this.SkillBonus].initial += 2;
    $("#RaceSkill" + BonusSelect).addClass('Selected');
  //Begin accounting, clean up, and verification methods:
    CurrentCharacter.ResetXP();
    CurrentCharacter.RecountTraits();
    CurrentCharacter.UpdateAttributes();
//End accounting, clean up, and verification methods.
  }
};
var Perk = function(n, c, d) {                         //Perk object to store related information
  this.name = n;                                       //Perk name
  this.cost = c;                                       //Perk Cost
  this.desc = d;                                       //Perk tooltip desc [DataBaseIn[Currently unused but present, I think?]
  this.active = false;                                 //Perk activation model
  this.locked = false;                                 //Perk locked flag
  this.ViewControl = $("#" + this.name + "Perk")       //Perk view controller
}
Perk.prototype.toggle = function() {                   //Perk toggling method for related object
  if (this.locked === false) {
    if (this.active === false && (CurrentCharacter.ActiveXP - this.cost) >= 0) {
      this.active = true;                                //Activate perk if previously deactivated
      CurrentCharacter.ActiveXP -= this.cost;            //Calculate new points, accounting for perk cost
      this.ViewControl.addClass("Selected");             //Update the view
    } else if (this.active === false && (CurrentCharacter.ActiveXP - this.cost) < 0) {
      alert("Not enough points remaining to do that");   //Unable to toggle perk due to insufficient points
    } else if (this.active === true) {
      this.active = false;                               //Deselect perk if previously activated
      CurrentCharacter.ActiveXP += this.cost;            //Calculate new points, accounting for perk cost
      this.ViewControl.removeClass("Selected");          //Update the view
    };

    if (this.name == "SpellBlade") {
      if (this.active) {
        CurrentCharacter.Skills["Casting"].initial++;
        CurrentCharacter.Skills["Striking"].initial++;

        CurrentCharacter.Perks["Free Prodigy(Casting or Striking)"] = new Perk ("Free Prodigy (Casting or Striking)", 0, "Prodigy granted to Hylians with Spell Blade");
        CurrentCharacter.Perks["Free Prodigy(Casting or Striking)"].active = true;
      } else {
        CurrentCharacter.Skills["Casting"].initial --;
        CurrentCharacter.Skills["Striking"].initial --;
        CurrentCharacter.Perks.splice(-1, 1);
      }
    }

    CurrentCharacter.UpdateBP();
  } else {
    alert("Perks can not be unselected after having been purchased");
  }
}
var Flaw = function(n, c, d, r) {                      //Flaw object to store related information
  this.name = n;                                       //Flaw name
  this.cost = c;                                       //Flaw cost
  this.oldCost = false;                                   //Flaw original cost flag
  this.desc = d;                                       //Flaw tooltip desc [Also currently unused, I think]
  this.active = false;                                 //Flaw activation model if real
  this.dummy = false;                                  //Flaw activation model if accountable
  this.conflict = r;                                   //Race name which does not allow this flaw's .active value to change
  this.ViewControl = $("#" + this.name + "Flaw");      //Flaw view controller
}
Flaw.prototype.toggle = function() {                   //Flaw de/activation method
  if (CharaGen ===  true) {
    var RaceName = CurrentCharacter.Race.name;
  } else {
    var RaceName = CurrentCharacter.Race
  }

  if (this.conflict == RaceName) {
    alert("Your chosen race can not do that");         //If flaw and race are conflicting
  } else {
    if (this.active && (CurrentCharacter.ActiveXP - this.cost) >= 0 && (WorkingFlawPoints + this.cost) <= FlawPoints) {
      this.active = false;                             //Deactive flaw if previous activated
      CurrentCharacter.ActiveXP -= this.cost;          //Calculate new real points, accounting for flaw cost
      WorkingFlawPoints += this.cost;                  //Calculate new maleable flaw points
      this.ViewControl.removeClass("Selected")         //Update related view
      if (this.originalCost) {
        this.cost = this.originalCost;                 //If this flaw's cost isn't it's current cost, reset it
        this.originalCost = false;                     //Then reset the flag to make it known it's back to base.
      }
    } else if (this.active && (CurrentCharacter.ActiveXP - this.cost) < 0) {
      alert("That action would spend more xp than is available."); //Do nothing if deactivating a flaw would put one in negative points
    } else if (this.dummy) {                           //If flaw was activated and not accountable
      this.dummy = false;                              //Deactivate the flaw
      this.ViewControl.removeClass("Selected");        //Update related view
    } else {
      if (WorkingFlawPoints > 0) {
        if ((WorkingFlawPoints - this.cost) >= 0) {      //If flaw inactive and within maleable flaw points
          this.active = true;                            //Activate related flaw
          CurrentCharacter.ActiveXP += this.cost;        //Calculate new real points, accounting for flaw cost
          WorkingFlawPoints -= this.cost;                //Calculate new maleable flaw points
          this.ViewControl.addClass("Selected")          //Update related view
        } else if ((WorkingFlawPoints - this.cost) < 0) {
          this.active = true;
          this.originalCost = this.cost;
          this.cost = WorkingFlawPoints;
          CurrentCharacter.ActiveXP += this.cost;
          WorkingFlawPoints = 0;
        }
      } else {
          this.dummy = true;                             //Otherwise, make it not accountable and fake a trigger
          this.ViewControl.addClass("Selected")          //Update related view with fake trigger
      }
    }
  }
  CurrentCharacter.UpdateBP()
}
var ActiveCharacter = function() {                     //Active character model for manipulating current information
  this.ArchetypeStat = false;                          //Character's Archetype Stat
  this.Race = false;                                   //Character's Race
  this.SkillBonus = false;                             //Character's Selected Racial Skill Bonus
  this.StatBonus = false;                              //Character's Selected Racial Stat Bonus
  this.Pass = false;
  this.CharName = false;
  this.Skills = {};                                    //Character's Skills Placeholder Container
  this.Stats = {};                            //Character's Stats Placeholder Container
  this.Races = {};                            //Container for all possible races for character
  this.Flaws = {};                            //Container for all possible flaws for character
  this.Perks = {};                            //Container for all possible perks for character
  this.ArchetypeSkills = new Array();                  //Character's Archetype Skills Placeholder Container
  this.BaseXP = 35;                                    //Character Base XP For Character Generation
  this.ActiveXP = 35;
  this.PostCount = 0;
  this.PostXP = 0;
  this.MortalXP = 0;
  this.UsedXP = 0;
  this.MortalLevel = 0;
  this.QuestXP = 0;
  this.CoreXP = 0;
  CurrentCharacter = this;
}
ActiveCharacter.prototype.ResetXP = function() {
  this.ActiveXP = this.BaseXP;                           //Reset live XP to base XP
}
ActiveCharacter.prototype.Archetype = function(val, type) {
  if (type === 1) {
    if (this.ArchetypeSkills.indexOf(val) >= 0) {
      this.ArchetypeSkills.splice(this.ArchetypeSkills.indexOf(val), 1);
      this.Skills[val].ATViewControl.removeClass("Selected");
      this.Skills[val].initial -= 2;
      this.Skills[val].current -= 2;
    } else if (this.ArchetypeSkills.indexOf(val) < 0 && this.ArchetypeSkills.length < 3) {
      this.ArchetypeSkills.push(val);
      this.Skills[val].ATViewControl.addClass("Selected");
      this.Skills[val].initial += 2;
    } else if (this.ArchetypeSkills.indexOf(val) < 0 && this.ArchetypeSkills.length >= 3) {
      alert("You must deselect an existing chosen archetype skill to select a new one");
    }
  } else if (type === 0) {
    if (this.ArchetypeStat === val) {
      this.Stats[val].ATViewControl.removeClass("Selected");
      this.Stats[val].initial -= 1;
      this.Stats[val].current -= 1;
      this.ArchetypeStat = false;
    } else if (this.ArchetypeStat != val && this.ArchetypeStat !== false) {
      alert("You must unselect your previously chosen Archetype Stat to select a new one");
    } else {
      this.ArchetypeStat = val;
      this.Stats[val].ATViewControl.addClass("Selected");
      this.Stats[val].initial++;
    }
  }

  this.ResetXP();
  this.RecountTraits();
  this.UpdateAttributes();
}
ActiveCharacter.prototype.EmptyFlaws = function() {
  for(var i in this.Flaws) {
    if (this.Flaws[i].active || this.Flaws[i].dummy) {
      this.Flaws[i].toggle();
    }
  }
}
ActiveCharacter.prototype.ToggleTrait = function(str, traitType) {
  console.log("Toggling "+traitType+": "+str)
  if (traitType == 'flaw') {
    for(var i in this.Flaws) {
      if (this.Flaws[i].name == str) {
        this.Flaws[i].toggle();
        console.log("Trait: "+this.Flaws[i].name+": Succesfully Toggled;")
      }
    }
  } else if (traitType == 'perk') {
    for(var i in this.Perks) {
      if (this.Perks[i].name == str) {
        this.Perks[i].toggle();
        console.log("Trait: "+this.Perks[i].name+": Succesfully Toggled;")
      }
    }
  }
}
ActiveCharacter.prototype.ToggleConflict = function(cnflt, rc) {
  for(var i in this.Flaws) {
    if (this.Flaws[i].name == cnflt) {
      this.Flaws[i].conflict = rc;
    }
  }
}
ActiveCharacter.prototype.ClearConflicts = function() {
  for(var i in this.Flaws) {
    this.Flaws[i].conflict = false;
  }
};
ActiveCharacter.prototype.AdjustCost = function(arg, argType) {
  if (argType == 'perk') {
    for(var i in arg) {
      for(var j in this.Perks) {
        if (this.Perks[j].name == arg[i][0]) {
          this.Perks[j].cost = arg[i][1];
        }
      }
    }
  } else if (argType == 'flaw') {
    for(var i in arg) {
      for(var j in this.Flaws) {
        if (this.Flaws[j].name == arg[i][0]) {
          this.Flaws[j].cost = arg[i][1];
        }
      }
    }
  }
}
ActiveCharacter.prototype.PreviousRaceClear = function(InputToggle, modifyingval, oldperkval) {
  var DeselectingPerk = this.Perks[oldperkval];
  $("#" + this.Race.name + "Div").removeClass('Selected');
  if (this.Perks[oldperkval].active) {
    this.ToggleTrait(this.Perks[oldperkval].name, "perk")
  };
  if (this.Race.StatBonus !== false) {
    this.Stats[this.Race.StatBonus].initial -= 1;
    this.Race.StatBonus = false;
  };
  if (this.Race.SkillBonus !== false) {
    this.Skills[this.Race.SkillBonus].initial -= 2;
    this.Race.SkillBonus = false;
  };

  this.ClearConflicts();

  switch (this.Race.name) {
    case "Kokiri":
      this.ToggleTrait(this.Race.SpecialPerk, "perk");
      this.Skills["NaturalAffinity"].initial -= 2;
      this.Skills["NaturalAffinity"].current -= 2;
      break;
    case "Sheikah":
      this.Perks[this.Race.SpecialPerk].toggle();
      SheikahArray = [["Stealth", 3],["IconicItemLesser", 4],["IconicItemModerate", 6],["IconicItemGreater", 8]]
      this.Perks["Stealth"].toggle();
      this.AdjustCost(SheikahArray, "perk");
      this.Skills["Athletics"].initial -= 2;
      this.Skills["Athletics"].current -= 2;
      break;
    case "Wizzrobe":
      this.ToggleTrait(this.Race.SpecialPerk, "perk");
      $("#RaceSubMenu2").html("");
      if (this.SkillBonus) {
        this.Skills[this.SkillBonus].initial -= 2;
        this.Skills[this.SkillBonus].current -= 2;
      }
      break;
    case "Stalfos":
      if (this.Flaws['WantedHyrule'].active) {
      	this.Flaws['WantedHyrule'].toggle();
      } else if (this.Flaws['WantedTermina'].active) {
      	this.Flaws['WantedTermina'].toggle();
      }
      FlawPoints = 10;
      WorkingFlawPoints = 10;
      this.ActiveXP -= 10;
      break;
    default:
      break;
  };

  DeselectingPerk.ViewControl.addClass("RacialPerk");
}
ActiveCharacter.prototype.ToggleRace = function(InputToggle) {
  var modifyingval = this.Races[InputToggle].racialPerk;
  var oldperkval = this.Race.racialPerk;

  if (this.Race !== false) {
    this.PreviousRaceClear(InputToggle, modifyingval, oldperkval)
  };

  this.Race = this.Races[InputToggle];
  this.ResetXP();
  this.RecountTraits();
  console.log('XP Reset')

  switch (this.Race.name) {
    case "Kokiri":
      this.Perks[this.Race.SpecialPerk].toggle();
      this.ToggleConflict("MagicalVoid", this.Race.name);
      this.Skills["NaturalAffinity"].initial += 2;
      break;
    case "Sheikah":
      this.Perks[this.Race.SpecialPerk].toggle();
      if(this.Perks["Stealth"].active == false){
        this.Perks["Stealth"].toggle();
      }
      SheikahArray = [["Stealth", 0],["IconicItemLesser", 2],["IconicItemModerate", 3],["IconicItemGreater", 6]]
      this.ToggleConflict("MagicalVoid", this.Race.name)
      this.ToggleConflict("Stealth", this.Race.name)
      this.AdjustCost(SheikahArray, "perk");
      this.Skills["Athletics"].initial += 2;
      this.ActiveXP += 3;
      break;
    case "Wizzrobe":
      this.Perks[this.Race.SpecialPerk].toggle();
      this.ToggleConflict("MagicalVoid", this.Race.name)
      $("#RaceSubMenu2").html("<div id='RaceSkillSubMenu'>Wizzrobe Skill Bonus<div id='RaceSkillSupport' class='RaceSkillChoice RaceSkillA Unselected' onClick='CurrentCharacter.Race.skillBonus(\"Support\")'> Support </div> OR <div id='RaceSkillCasting' class='RaceSkillChoice RaceSkillB Unselected' onClick='CurrentCharacter.Race.skillBonus(\"Casting\")'>Casting</div>");
      break;
    case "Stalfos":
      this.Flaws['WantedHyrule'].toggle();
      this.Flaws['WantedTermina'].toggle();
      this.ToggleConflict("WantedHyrule", this.Race.name);
      this.ToggleConflict("WantedTermina", this.Race.name);
      FlawPoints = 5;
      WorkingFlawPoints = 5;
      break;
    case "Hylian":
      this.ToggleConflict("MagicalVoid", this.Race.name)
      break;
    default:
      $("#RaceSubMenu2").html("&nbsp;");
      break;
  };
  console.log("Switch Case Succeeded. XP Available ="+this.ActiveXP)
  this.UpdateAttributes();
  console.log("Attributes Updated, Traits accounted for")
  $("#" + modifyingval + "Perk").removeClass("RacialPerk");
  $("#" + this.Race.name + "Div").toggleClass("Selected");
  $("#RaceSubMenu").html("<div id='RaceStatSubMenu'>Choose Your Bonus: <div id='Race" + this.Race.bonusOne + "StatDiv' class='RaceStatChoice RaceA RaceStatUnselected' onClick='CurrentCharacter.Race.toggleBonus(\"" + this.Race.bonusOne + "\")'>" + this.Race.bonusOne + "</div> OR <div id='Race" + this.Race.bonusTwo + "StatDiv' class='RaceStatChoice RaceB RaceStatUnselected' onClick='CurrentCharacter.Race.toggleBonus(\"" + this.Race.bonusTwo + "\")'> " + this.Race.bonusTwo + "</div>");
};
ActiveCharacter.prototype.RecountTraits = function() {
  for(var i in this.Flaws) {
    if (this.Flaws[i].active && CharaGen === true) {
      this.ActiveXP += this.Flaws[i].cost;
    }
  }
  for(var i in this.Perks) {
    if (this.Perks[i].active && this.Perks[i].locked === false) {
      this.ActiveXP -= this.Perks[i].cost;
    }
  }

  this.UpdateBP();
}
ActiveCharacter.prototype.UpdateAttributes = function() {

  for(var i in this.Stats) {
    this.Stats[i].base = this.Stats[i].spent + this.Stats[i].initial;
    this.Stats[i].current = this.Stats[i].initial;
    for(var j = this.Stats[i].initial; j < this.Stats[i].base; j++) {
        this.Stats[i].add('free');
    }
    this.Stats[i].ViewControl.html(this.Stats[i].current);
  }
  for(var i in this.Skills) {
    this.Skills[i].base = this.Skills[i].spent + this.Skills[i].initial;
    this.Skills[i].current = this.Skills[i].initial;
    for(var j = this.Skills[i].initial; j < this.Skills[i].base; j++) {
        this.Skills[i].add('free');
    }
    this.Skills[i].ViewControl.html(this.Skills[i].current);
  }

  this.UpdateBP();

}
ActiveCharacter.prototype.Export = function() {
  if (this.ActiveXP >=0 && this.ActiveXP <= 2 ) {
    if ((this.Race !== false) && (this.ArchetypeStat !== false) && (this.Race.StatBonus !== false) && (this.ArchetypeSkills.length = 3)) {
      $("#ExportBody").show();
      var PerkPrintList = "", FlawPrintList = "";

      for (var ATSkillPrint in this.ArchetypeSkills) {
        $("#ATSkill" + ATSkillPrint + "Export").html("[i] +2 " + this.ArchetypeSkills[ATSkillPrint] + "[/i]");
      };
      for (var StatExport in this.Stats) {
        $("#" + this.Stats[StatExport].name + "Export").html("[*]" + this.Stats[StatExport].name + ": " + this.Stats[StatExport].current + "[/*]");
      };
      for (var SkillExport in this.Skills) {
        $("#" + this.Skills[SkillExport].name + "Export").html("[*]" + this.Skills[SkillExport].name + ": " + this.Skills[SkillExport].current + "[/*]");
      };
      for (var PerkExport in this.Perks) {
        if (this.Perks[PerkExport].active) {
          PerkPrintList += "[*]" + this.Perks[PerkExport].name + "[/*]<br>";
        }
      };
      for (var FlawExport in this.Flaws) {
        if (this.Flaws[FlawExport].active) {
          FlawPrintList += "[*]" + this.Flaws[FlawExport].name + "[/*]<br>";
        }
      };

      $("#RaceExport").html("[b]Race[/b]: " + this.Race.name + "(With +1 " + this.Race.StatBonus + " Chosen)");
      //$("#ATExport").html($("ArchetypeName").value);
      $("#ATStatExport").html("[i] +1 " + this.Stats[this.ArchetypeStat].name + "[/i]");
      $("#PerkExport").html(PerkPrintList);
      $("#FlawExport").html(FlawPrintList);
    } else {
      alert("Please ensure you have selected all available bonuses, archetype information, and race");
    }
  } else {
    alert("Please ensure your bonus points remaining are between 0 and 2")
  }
}
ActiveCharacter.prototype.Refresh = function() {
  if (CharaGen == true) {

  } else {
    $("#ATStat").html(this.ArchetypeStat);
    $("#CharRace").html(this.Race);

    for(i in this.ArchetypeSkills) {
      ATName = this.ArchetypeSkills[i]
      $("#ATSkill"+i).html(ATName);
    }

    for(i in this.Stats) {
      this.Stats[i].current = this.Stats[i].initial;
      this.Stats[i].spent = 0;
      this.Stats[i].ViewControl.html(this.Stats[i].initial);
    }

    for(i in this.Skills) {
      this.Skills[i].current = this.Skills[i].initial;
      this.Skills[i].spent = 0;
      this.Skills[i].ViewControl.html(this.Skills[i].initial);
    }
  }
}
ActiveCharacter.prototype.CalcHP = function() {

}
ActiveCharacter.prototype.CalcDef = function() {

}
ActiveCharacter.prototype.UpdateBP = function() {
  $("#BPLEFT").html(this.ActiveXP + " points left");
};

ActiveCharacter.prototype.PopulateCharacter = function(IncomingCharacter) {
  this.Race = IncomingCharacter["Race"];
  this.CharName = IncomingCharacter["CharName"];
  this.Pass = IncomingCharacter["Password"];
  this.ArchetypeStat = (IncomingCharacter["ArchetypeStat"]);
  this.ArchetypeSkills[0] = (IncomingCharacter["ArchetypeSkill1"]);
  this.ArchetypeSkills[1] = (IncomingCharacter["ArchetypeSkill2"]);
  this.ArchetypeSkills[2] = (IncomingCharacter["ArchetypeSkill3"]);
  this.CoreXP = Number(IncomingCharacter["XPLeft"]);
  this.ActiveXP = this.CoreXP;
  this.BaseXP = this.CoreXP;
  this.MortalLevel = Number(IncomingCharacter["MortalThreshold"]);
  MortalCheck = Number(IncomingCharacter["MortalCheck"]);
  this.PostCount = Number(IncomingCharacter["PostCount"]);
  this.QuestXP = Number(IncomingCharacter["QuestXP"]);
  this.XPUsed = Number(IncomingCharacter["XPUsed"]);
  this.BonusXP = Number(IncomingCharacter["BonusXP"]);

  for (i in this.Stats) {
    this.Stats[i].initial = Number(IncomingCharacter[this.Stats[i].name]);
  }
  for (i in this.Skills) {
    this.Skills[i].initial = Number(IncomingCharacter[this.Skills[i].name]);
  }
  for (i in this.Perks) {
    this.Perks[i].active = Boolean(Number(IncomingCharacter[this.Perks[i].name]));
    this.Perks[i].cost *= 2;
    if (this.Perks[i].active == true) {
      this.Perks[i].locked = true;
      this.Perks[i].ViewControl.addClass("Selected");
    }
  }
  for (i in this.Flaws) {
    this.Flaws[i].active = Boolean(Number(IncomingCharacter[this.Flaws[i].name]));
    if (this.Flaws[i].active == false) {
      this.Flaws[i].cost = 0;
    } else {
      this.Flaws[i].active = true;
      //this.Flaws[i].cost = 0-Number(this.Flaws[i].cost);
      this.Flaws[i].ViewControl.addClass("Selected");
    }
  }

  this.CheckMortality();

  BaseCharacter = this;
  CharaGen = false;
  this.UpdateXP();
  this.UpdateMinimums();
  this.Refresh();
  CharaGen = false;
  if (CharaGen == false) {
    CharaGen = false;
  }

}
ActiveCharacter.prototype.CheckMortality = function() {
  if (MortalCheck) {
    $("#MortalForm :input").prop("disabled", true);
    $("#NoMortal").hide();
    $("#NoMortalLbl").hide();
    $("#MortalInput").prop("disabled", true);
  } else {
    $("#MortalInput").hide();
  }
}
ActiveCharacter.prototype.UpdateXPView = function() {
  $("#QuestXPInput").val(this.QuestXP);
  $("#PostCountInput").val(this.PostCount);
  $("#MortalInput").val(this.MortalLevel);
}
ActiveCharacter.prototype.UpdateXP = function() {
  TotalXP = 0;

  if (this.PostCount) {
    if (this.PostCount > 1500) {
      this.PostXP = 150
      this.PostXP += Math.floor((Number(this.PostCount)-1500)/20);
    } else {
      this.PostXP = Math.floor(this.PostCount/10);
    }
  }
  if (this.MortalLevel) {
    if (this.PostCount > 1500) {
      this.MortalXP = Math.floor((1500 - Number(this.MortalLevel))/50);
      this.MortalXP += Math.floor(((Number(this.PostCount) - 1500) - Number(this.MortalLevel))/50);
    } else {
      this.MortalXP = Math.floor((Number(this.PostCount) - Number(this.MortalLevel))/50);
    }
  }
  if (this.QuestXP) {
    this.QuestXP = Number(this.QuestXP);
  }

  if (this.MortalXP < 0) {
    this.MortalXP = 0;
  }


  this.BaseXP = this.PostXP + this.MortalXP + this.QuestXP + this.CoreXP + this.BonusXP;
  console.log(this.MortalLevel +"|"+ this.XPUsed +"|"+ this.MortalXP +"|"+ this.QuestXP +"|"+ this.CoreXP +"|"+ this.BonusXP);
  this.ActiveXP = this.BaseXP - this.XPUsed;
  this.UpdateXPView();
  this.RecountTraits();
  this.UpdateAttributes();
  this.UpdateBP();
}

ActiveCharacter.prototype.CreateNewCharacter = function() {
  if (this.ActiveXP >=0 && this.ActiveXP <= 2 ) {
    if ((this.Race !== false) && (this.ArchetypeStat !== false) && (this.Race.StatBonus !== false) && (this.ArchetypeSkills.length = 3)) {
      if (this.Pass !== false && this.CharaName !== false) {
        if (confirm('Are you sure wish to submit this character? This action can not be undone')) {
          alert("Query Proceeding");
          SendingCharacter = {};

          SendingPass = this.Pass;
          SendingName = this.CharName;
          SendingCharacter["ArchetypeStat"] = this.ArchetypeStat;
          SendingCharacter["Race"] = this.Race.name;
          SendingCharacter["CharName"] = SendingName;
          SendingCharacter["UserName"] = SendingName;
          SendingCharacter["Password"] = SendingPass;
          SendingCharacter["XPUsed"] = 0;

          for(i in this.Skills) {
            SendingCharacter[this.Skills[i].name] = this.Skills[i].current;
          }
          for(i in this.Stats) {
            SendingCharacter[this.Stats[i].name] = this.Stats[i].current;
          }
          for(i in this.ArchetypeSkills) {
            var x = i;
                x++;
            SendingCharacter["ArchetypeSkill"+ x] = this.ArchetypeSkills[i];
          }
          for(i in this.Flaws) {
            if (this.Flaws[i].active) {
              SendingCharacter[this.Flaws[i].name] = 1;
            } else {
              SendingCharacter[this.Flaws[i].name] = 0;
            }
          }
          for(i in this.Perks) {
            if (this.Perks[i].active) {
              SendingCharacter[this.Perks[i].name] = 1;
            } else {
              SendingCharacter[this.Perks[i].name] = 0;
            }
          }
          console.log (this.CharName + " is being submitted");

          if (CharaGen == true) {
            SendingCharacter["XPLeft"] = this.ActiveXP;
            console.log()

            $.ajax({
              url: "inc/char_entry.php",
              type: "POST",
              datatype: "json",
              data: {"ReadCharacter": SendingCharacter},
              success: function(data) {
              console.log(data);
              GimmeInfo = $.parseJSON(data);
                if (GimmeInfo["success"] = "true") {
                  alert("Character succesfully submitted");
                  window.location="index.php?mode=LoggedIn&Character="+SendingName;
                } else {
                  alert(GimmeInfo["message"]);
                }
              },
              fail: function(data) {
                console.log("NOPE");
                //console.log(data);
              }
            })
          }
        } else {
          alert("Query Canceled");
        }
      } else {
        alert("An error has occured, please try again or contact a system administrator");
      }
    } else {
      confirm("Please make sure a race and all relevant chocies are made and all archetype information has been selected");
    }
  } else {
    confirm("Please ensure points remaining are between 0 and 2 then try again");
  }
}
ActiveCharacter.prototype.ReUpdateAll = function() {
  for(i in this.Stats) {
    this.Stats[i].initial = this.Stats[i].current;
    this.Stats[i].spent = 0;
  }
  for(i in this.Skills) {
    this.Skills[i].initial = this.Skills[i].current;
    this.Skills[i].spent = 0;
  }
  for(i in this.Perks) {
    if (this.Perks[i].active == true) {
      this.Perks[i].locked = true;
    }
  }

  this.UpdateMinimums();
  this.CheckMortality();
}

ActiveCharacter.prototype.UpdateCharacter = function() {
  if (confirm(("All changes made to character are final and can not be undone after being updated, are you use you with to submit?"))) {
    SendingCharacter = {};

    SendingPass = this.Pass;
    SendingName = this.CharName;
    console.log (this.CharName + " is being updated");
    SendingCharacter["ArchetypeStat"] = this.ArchetypeStat;
    SendingCharacter["Race"] = this.Race;
    SendingCharacter["XPUsed"] = this.BaseXP - this.ActiveXP;

    for(i in this.Skills) {
      SendingCharacter[this.Skills[i].name] = this.Skills[i].current;
    }
    for(i in this.Stats) {
      SendingCharacter[this.Stats[i].name] = this.Stats[i].current;
    }
    for(i in this.ArchetypeSkills) {
      var x = i;
          x++;
      SendingCharacter["ArchetypeSkill"+ x] = this.ArchetypeSkills[i];
    }
    for(i in this.Flaws) {
      if (this.Flaws[i].active) {
        SendingCharacter[this.Flaws[i].name] = 1;
      } else {
        SendingCharacter[this.Flaws[i].name] = 0;
      }
    }
    for(i in this.Perks) {
      if (this.Perks[i].active) {
        SendingCharacter[this.Perks[i].name] = 1;
      } else {
        SendingCharacter[this.Perks[i].name] = 0;
      }
    }

    console.log(MortalCheck ? this.MortalLevel : "no");
    SendingCharacter["MortalCheck"] = MortalCheck == true ? 1 : 0;
    SendingCharacter["MortalThreshold"] = MortalCheck == true  ? Number(this.MortalLevel) : 0;
    SendingCharacter["PostCount"] = this.PostCount;
    SendingCharacter["QuestXP"] = this.QuestXP;
    SendingCharacter["BonusXP"] = this.BonusXP;
    SendingCharacter["XPUsed"] = this.BaseXP - this.ActiveXP;
    console.log(SendingCharacter);

    $.ajax({
        url: "inc/char_update.php",
        type: "POST",
        data: {"UpdatingCharacter": SendingCharacter, "CharName": SendingName},
        datatype: "json",
        success: function(data) {
          console.log(data);
          CurrentCharacter.ReUpdateAll();
        },
        fail: function(data) {
          console.log(data);
        }
    })
  }
}

ActiveCharacter.prototype.UpdateMinimums = function() {
  $("#QuestXPInput").attr('min', this.QuestXP);
  $("#PostCountInput").attr('min', this.PostCount);
  $("#MortalInput").attr('min', this.MortalLevel);
}
////////////////////////////////////////////////////////////////////////////////////////
//			The Following Creates the Shell for the current character by
//        Instantiating an instance of ActiveCharacter, the main controller
//          This variable will always be present and always be used, no exceptions.
////////////////////////////////////////////////////////////////////////////////////////
var CurrentCharacter = new ActiveCharacter();
var BaseCharacter = new ActiveCharacter();
////////////////////////////////////////////////////////////////////////////////////////
//			The Following Gets the CurrentCharacter.Stats, CurrentCharacter.Skills, CurrentCharacter.Races, CurrentCharacter.Perks and CurrentCharacter.Flaws
//				from the mySQL DB through AJAX/mySQLi functions and dumps them
//					into a JS object where they populate the shell information in CurrentCharacter
////////////////////////////////////////////////////////////////////////////////////////
function CreateShell(forcefalse) {
  if (forcefalse) {
    dataoutput = {gimmefalse: 'Nope'};
  } else {
    dataoutput = {id: 'DBInfo'};
  }

  $.ajax({
    url: "inc/db_ajax.php",
    type: "POST",
    async: false,
    data: dataoutput,
    datatype: 'json',
    error: function(error) {
      console.log("I failed");
      console.log(data);
    },
    success: function(data) {
      DataBaseIn = $.parseJSON(data);
      var i = 0;
      for (var CurRace in DataBaseIn["races"]) {
        CurrentCharacter.Races[CurRace] = new Race(i, CurRace, DataBaseIn['races'][CurRace]["racial_stat_mod_one"], DataBaseIn['races'][CurRace]["racial_stat_mod_two"], DataBaseIn['races'][CurRace]["racial_perk"], DataBaseIn['races'][CurRace]["racial_trigger_perk"]);
        i++;
      }
      for (var CurPerk in DataBaseIn["perks"]) {
        CurrentCharacter.Perks[CurPerk] = new Perk(CurPerk, Number(DataBaseIn['perks'][CurPerk]["cost"]));
      };
      for (var CurFlaws in DataBaseIn["flaws"]) {
        CurrentCharacter.Flaws[CurFlaws] = new Flaw(CurFlaws, Number(DataBaseIn['flaws'][CurFlaws]["cost"]));
      };
      for (var CurStats in DataBaseIn["stats"]) {
        CurrentCharacter.Stats[CurStats] = new Attribute("stat", CurStats, 2, 2);
      }
      for (var CurSkills in DataBaseIn["skills"]) {
        CurrentCharacter.Skills[CurSkills] = new Attribute("skill", CurSkills, 0, 0, DataBaseIn['skills'][CurSkills]["stat_govern"]);
      }
    }
  });
}

/*function ValidateForm(CharName, UserName, UsrPassword, event) {
  event.preventDefault();

  $.ajax({
    url: "inc/process_login.php",
    type: "POST",
    data: {charname: CharName, p: UsrPassword},
    error: function(data) { console.log(data) },
    success: function(data) {
      console.log("Succesfully Logged In");
      console.log(data);
      GetCharacter(CharName);
    }
  })
}
function GetCharacter(charname) {

}
*/
function Enter(loc) {

  switch (loc) {

    case 1:
      SubmitPassword = $("#PasswordSubmitInput").val();
      SubmitCharName = $("#NameSubmitInput").val();
      //SecurePassword = hex_sha512(SubmitPassword);
      console.log("Logging in");
      $.ajax({
        url: 'inc/process_login.php',
        type: 'POST',
        datatype: 'json',
        data: {
          'charname': SubmitCharName,
          'p': SubmitPassword
        },
        success: function(data) {
          console.log("Success, Returning: "+data);
          GimmeInfo = $.parseJSON(data);
          if (GimmeInfo["success"] == "true") {
              if (GimmeInfo["new"] == "true") {
                SetupCharacterCreation(SubmitCharName, SubmitPassword);
              } else {
                  window.location="index.php?mode=LoggedIn&Character="+SubmitCharName;
              }
          } else {
            alert("Invalid username or password");
            $("#MsgBoxPar").html(GimmeInfo);
          }
        },
        fail: function(data) {
          console.log(data);
          alert("Invalid input, please try again or contact a system administrator.");
        }
      }).done( function (data) {
      });
    break;

    case 2:
      window.location="index.php?mode=Register";
    break;

    default:
      $("#Cover").hide();
    break;

  }

}

function Register() {
  SubmitPassword = $("#PasswordSubmitInput").val();
  ConfirmPassword = $("#PasswordConfirmInput").val();
  SubmitCharName = $("#NameSubmitInput").val();
  SubmitEmail = $("EmailSubmitInput").val();

  re = /^\w+$/;
  if (!re.test(SubmitCharName)) {
    $("#MsgBoxPar").html("Username must contain only letters, numbers and underscores. Please try again");
    $("#NameSubmitInput").focus();
  } else if (SubmitPassword.length < 6) {
    $("#MsgBoxPar").html('Passwords must be at least 6 characters long.  Please try again');
    $("#PasswordSubmitInput").password.focus();
  } else if (SubmitPassword == ConfirmPassword) {
    //SecurePassword = hex_sha512(SubmitPassword);

    $.ajax({
      url: 'inc/register.inc.php',
      type: 'POST',
      datatype: 'json',
      data: {
        'charname': SubmitCharName,
        'p': SubmitPassword
      },
      success: function(data) {
        console.log("Successfully posted");
        GimmeInfo = $.parseJSON(data);
        if (GimmeInfo["success"] == "true") {
          if (confirm("Character Succesfullly Registered, would you like to start editing this character now?")) {
            SetupCharacterCreation(SubmitCharName, SubmitPassword);
          } else {
            window.location = "index.php";
          }
        } else {
          $("#MsgBoxPar").html(GimmeInfo["message"]);
        }

      },
      fail: function(data) {
        console.log("Invalid input, please try again or contact a system administrator.");
        $("#MsgBoxPar").html("Invalid input, please try again or contact a system administrator.");
      }
    })
  } else {
    $("#MsgBoxPar").html("Passwords must match.")
  }
}

function DrawChar(NewCharacter) {
    $.ajax({
      url: 'inc/process_character.php',
      type: 'POST',
      datatype: 'json',
      data: {
        'LoadingCharacter': NewCharacter
      },
      success: function(data) {
        console.log("Successfully posted");
        GimmeInfo = $.parseJSON(data);
        if (GimmeInfo["message"] == "false") {
          console.log(GimmeInfo["reason"]);
        } else {
          CurrentCharacter.PopulateCharacter(GimmeInfo);
          $("#UpdateButton").show();
          CharaGen = false;
        }
      },
      fail: function(data) {
        console.log("Invalid input, please try again or contact a system administrator.");
        $("#MsgBoxPar").html("Invalid input, please try again or contact a system administrator.");
      }
    })
}

function Logout() {
  $.ajax({
    url: 'inc/logout.php',
    type: 'POST',
    datatype: 'json',
    success: function(data) {
      console.log("Successfully posted");
      incoming = $.parseJSON(data);
      if(incoming["success"] == "true"){
        window.location = "index.php";
      }
    }
  })
}

function SetupCharacterCreation(chara, pass) {
  CurrentCharacter.CharName = chara;
  CurrentCharacter.Pass = pass;
  $('#SubmitButton').show();
  $('#TopMenuNameLabel').html("Creating Character: ");
  $('#TopMenuName').val(chara);
  $("#Cover").hide();
}

$('document').ready(function() {
  if(CharaGen){
    CurrentCharacter.UpdateBP()
  }

  $("#charsecretinput").ready(function() {
    if ($("#charsecretinput").val()) {
      DrawChar($("#charsecretinput").val());
    }
  })

  $("#YesMortal").click(function() {
    if (MortalCheck == false) {
      MortalCheck = true;
      $("#MortalCutOff").show();
      $("#MortalInput").show();
    }
  })

  $("#NoMortal").click(function() {
    if (MortalCheck === true) {
      MortalCheck = false;
      $("#MortalCutOff").hide();
    }
  })

  $("#QuestXPInput").on('blur', function() {
    NewQXP = Number($("#QuestXPInput").val());
    if (NewQXP >= Number($("#QuestXPInput").attr('min')) && NewQXP <= Number($("#QuestXPInput").attr('max'))) {
      CurrentCharacter.QuestXP += (NewQXP > CurrentCharacter.QuestXP) ? (NewQXP - CurrentCharacter.QuestXP) : 0;
      CurrentCharacter.UpdateXP();
    } else {
      alert("Your Quest XP is currently set to an invalid option, please ensure it's within your previous number and the max quest xp.");
      $("#QuestXPInput").focus();
    }
  })

  $("#PostCountInput").on('blur', function() {
    if ($("#PostCountInput").val() >= Number($("#PostCountInput").attr('min'))) {
      CurrentCharacter.PostCount = Number($("#PostCountInput").val());
      CurrentCharacter.UpdateXP();
    } else {
      alert("Your Post Count can not drop below a previously saved value");
      $("#PostCountInput").focus();
    }
  })

  $("#MortalInput").on('blur', function() {
    NewMortalLevel = Number($("#MortalInput").val());
    console.log(NewMortalLevel);
    if (NewMortalLevel >= Number($("#MortalInput").attr('min'))) {
      CurrentCharacter.MortalLevel += (NewMortalLevel > Number(CurrentCharacter.MortalLevel)) ? (NewMortalLevel - Number(CurrentCharacter.MortalLevel)) : 0;
      console.log(CurrentCharacter.MortalLevel)
      CurrentCharacter.UpdateXP();
    } else {
      alert("Your Mortal Level can not drop below a previously saved value");
      $("#MortalInput").focus();
    }
  })
})

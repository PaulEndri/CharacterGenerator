function CreateMongoCollections() {
var StringCollection = "";
  for (var CurFlaws in DataBaseIn["flaws"]) {
    StringCollection += "<br>db.Flaws.insert( "
      for(var Elem in CurFlaws) {
        for(var Key in Elem) {
          StringCollection += Key+": "+Elem+","
        }
      }
    StringCollection += ")"
  }

  for (var CurRaces in DataBaseIn["races"]) {
    StringCollection += "<br>db.Races.insert("+JSON.stringify(CurRaces)+")";
  }

  for (var CurPerks in DataBaseIn["perks"]) {
    StringCollection += "<br>db.Perks.insert("+JSON.stringify(CurPerks)+")";
  }

  for (var CurSkills in DataBaseIn["skills"]) {
    StringCollection += "<br>db.Skills.insert("+JSON.stringify(CurSkills)+")";
  }

  for (var CurStats in DataBaseIn["stats"]) {
    StringCollection += "<br>db.Stats.insert("+JSON.stringify(CurStats)+")";
  }

  document.write(StringCollection);

}

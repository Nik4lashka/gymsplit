// ==========================
// Einstellungen
// ==========================

let fm = FileManager.iCloud();

let splitPath = fm.joinPath(
  fm.documentsDirectory(),
  "split.json.txt"
);

let settingsPath = fm.joinPath(
  fm.documentsDirectory(),
  "memory.json.txt"
);


// ==========================
// Trainingsplan laden
// ==========================

let splitText = fm.readString(splitPath);
let splitObject = JSON.parse(splitText);

// Namen der Trainingstage
let split = Object.keys(splitObject);


// ==========================
// Einstellungen laden
// ==========================

let settings;

if (fm.fileExists(settingsPath)) {
  settings = JSON.parse(
    fm.readString(settingsPath)
  );
} else {
  settings = {
    index: 0,
    lastDate: ""
  };
}


// ==========================
// Datum prüfen
// ==========================

function getDateString(date) {
  return date.toISOString().slice(0, 10);
}

let today = getDateString(new Date());


// Wenn neuer Tag -> nächster Split
if (settings.lastDate !== today) {

  settings.index =
    (settings.index + 1) % split.length;

  settings.lastDate = today;

  fm.writeString(
    settingsPath,
    JSON.stringify(settings)
  );
}


let currentSplit = split[settings.index];


// ==========================
// Manuelle Änderung
// (nur wenn Script normal geöffnet)
// ==========================

if (!config.runsInWidget) {

  let alert = new Alert();

  alert.title = "Training auswählen";

  for (let name of split) {
    alert.addAction(name);
  }

  alert.addCancelAction("Abbrechen");

  let result = await alert.present();

  if (result !== -1) {

    settings.index = result;
    settings.lastDate = today;

    fm.writeString(
      settingsPath,
      JSON.stringify(settings)
    );

    currentSplit = split[settings.index];
  }
}


// ==========================
// Widget erstellen
// ==========================

let widget = new ListWidget();

widget.backgroundColor = new Color("#111111");


let title = widget.addText("Heute");
title.font = Font.boldSystemFont(14);


widget.addSpacer(8);


let training = widget.addText(currentSplit);

training.font = Font.boldSystemFont(28);


widget.addSpacer();


let dateText = widget.addText(today);
dateText.font = Font.systemFont(12);


Script.setWidget(widget);

Script.complete();
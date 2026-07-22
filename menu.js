// ==========================
// Dateien
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
// Split laden
// ==========================

let splitObject = JSON.parse(
  fm.readString(splitPath)
);

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
    lastDate: new Date()
      .toISOString()
      .slice(0, 10)
  };

  fm.writeString(
    settingsPath,
    JSON.stringify(settings, null, 2)
  );
}


let currentSplit = split[settings.index];

let today = new Date()
  .toISOString()
  .slice(0, 10);


// ==========================
// Hauptmenü
// ==========================

let menu = new Alert();

menu.title = currentSplit;

menu.addAction("HTML öffnen");
menu.addAction("Training auswählen");

let choice = await menu.present();


// ==========================
// HTML öffnen
// ==========================

if (choice === 0) {

  let htmlFile = currentSplit + ".html";

  let htmlPath = fm.joinPath(
    fm.documentsDirectory(),
    htmlFile
  );


  if (fm.fileExists(htmlPath)) {

    let html = fm.readString(htmlPath);

    let webView = new WebView();

    await webView.loadHTML(html);

    await webView.present();

  } else {

    let error = new Alert();

    error.title = "Fehler";

    error.message =
      "Datei nicht gefunden:\n" + htmlFile;

    error.addAction("OK");

    await error.present();
  }
}


// ==========================
// Training auswählen
// ==========================

if (choice === 1) {

  let select = new Alert();

  select.title = "Training auswählen";


  for (let day of split) {
    select.addAction(day);
  }


  select.addCancelAction("Abbrechen");


  let selected = await select.present();


  if (selected !== -1) {

    settings.index = selected;

    // verhindert, dass morgen sofort wieder weitergesprungen wird
    settings.lastDate = today;


    fm.writeString(
      settingsPath,
      JSON.stringify(settings, null, 2)
    );


    let saved = new Alert();

    saved.title = "Gespeichert";

    saved.message =
      "Heute: " + split[selected];

    saved.addAction("OK");

    await saved.present();
  }
}


Script.complete();
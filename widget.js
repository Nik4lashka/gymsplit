// First of all the split gets parsed from the json file

let fm = FileManager.iCloud();

let path = fm.joinPath(fm.documentsDirectory(), "split.json.txt");

let rawText = fm.readString(path);

let trainings = JSON.parse(rawText);

let trainingDays = Object.keys(trainings);

console.log(trainings);
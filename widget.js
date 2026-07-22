// First of all the split gets parsed from the json file

let fm = FileManager.iCloud();

let path = fm.joinPath(fm.documentsDirectory(), "split.json");

let jsonText = fm.readString(path);

let data = JSON.parse(jsonText);

console.log(data);
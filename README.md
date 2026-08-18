# noffyTranslate
extension changes text on websites into the "noffonordacki" language in a very goofy way.

if you dont know what "noffonordacki" it just makes reading normal websites crazy.

# Note about Manifests
this project has two manifest files depending on your browser:
- **firefox** uses Manifest V2 (`manifest2.json`)
- **chrome / edge / brave:** uses Manifest V3 (`manifest3.json`)

*if you use Chrome rename `manifest3.json` to `manifest.json` before loading*

# How to install
since this is a joke project, you have to add it manually:
  1. download this project as a ZIP file (click the green "Code" button, then "Download ZIP")
  2. extract the folder somewhere on your computer

# Google Chrome (or Edge / Brave)
  1. rename `manifest_v3.json` to `manifest.json` in your folder
  2. open browser
  3. in the address bar at the top type `chrome://extensions` and press enter
  4. look at the top right corner and turn on "Developer mode"
  5. click the button "Load unpacked"
  6. select the folder you unzipped
  7. enjoy!

# Mozilla Firefox
  1. make sure `manifest.json` (Manifest V2) is in your folder
  2. open browser
  3. in the address bar at the top type `about:debugging` and press enter
  4. on the left side click on "This Firefox"
  5. find the button that says "Load Temporary Add-on..." and click it
  6. go to the folder you unzipped and select the `manifest.json` file
  7. enjoy!

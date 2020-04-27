const electron = require("electron");
const simpleGit = require("simple-git")();
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const dialog = electron.dialog;
const ipcMain = electron.ipcMain;

const path = require("path");
const url = require("url");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { nodeIntegration: true },
  });
  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, "/../build/index.html"),
      protocol: "file:",
      slashes: true,
    });
  mainWindow.loadURL(startUrl);

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("selectDirectory", (event) => {
  dialog
    .showOpenDialog(mainWindow, {
      properties: ["openDirectory"],
    })
    .then((directory) => {
      if (directory && directory.filePaths && directory.filePaths.length) {
        simpleGit.cwd(directory.filePaths[0]).checkIsRepo((err, isRepo) => {
          if (err) {
            event.sender.send("selectedDirectory", {
              isRepo: false,
              path: directory.filePaths[0],
            });
            return;
          }
          event.sender.send("selectedDirectory", {
            isRepo,
            path: directory.filePaths[0],
          });
        });
      }
    });
});

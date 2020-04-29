const electron = require("electron");
const simpleGit = require("simple-git")();
const os = require("os");
const fs = require("fs");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const dialog = electron.dialog;
const ipcMain = electron.ipcMain;

const path = require("path");
const url = require("url");

const repositories = require("./db/repositories.json");

let mainWindow;

function createWindow() {
  BrowserWindow.addDevToolsExtension(
    path.join(
      os.homedir(),
      "/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.6.0_0"
    )
  );

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
  mainWindow.webContents.openDevTools();

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

ipcMain.on("asynchronous-message", (event, arg) => {
  const { uuid, messageType, data } = arg;
  switch (messageType) {
    case "INITIALIZE_DIRECTORY_SELECTION":
      initializeDirectorySelection(event, uuid);
      break;
    case "GET_REPOSITORIES":
      getRepositories(event, uuid);
      break;
    default:
      break;
  }
});

const asynchronousReply = (event, uuid, data) => {
  event.sender.send("asynchronous-reply", { uuid, data });
};

const getRepositories = (event, uuid) => {
  asynchronousReply(event, uuid, { repositories });
};

const addRepository = (path, callback) => {
  if (repositories.indexOf(path) > -1) {
    callback();
  } else {
    repositories.push(path);
    const pathToRepositories = __dirname + "/db/repositories.json";
    fs.writeFile(pathToRepositories, JSON.stringify(repositories), (err) => {
      if (err) {
        console.log(err);
        return;
      }
      callback();
    });
  }
};

const onDirectorySelected = (event, uuid, directory) => {
  if (directory && directory.filePaths && directory.filePaths.length) {
    const path = directory.filePaths[0];
    simpleGit.cwd(path).checkIsRepo((err, isRepo) => {
      if (err || !isRepo) {
        asynchronousReply(event, uuid, { isRepo: false, path });
        return;
      }
      addRepository(path, () => {
        asynchronousReply(event, uuid, { isRepo, path });
      });
    });
  }
};

const initializeDirectorySelection = (event, uuid) => {
  dialog
    .showOpenDialog(mainWindow, { properties: ["openDirectory"] })
    .then((directory) => {
      onDirectorySelected(event, uuid, directory);
    });
};

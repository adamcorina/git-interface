const electron = require("electron");
const simpleGit = require("simple-git")();
const os = require("os");
const fs = require("fs");
const async = require("async");
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
    width: 1250,
    height: 1000,
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
    case "GET_BRANCHES":
      getBranches(event, uuid, data);
      break;
    case "GET_BRANCH_INFO":
      getBranchInfo(event, uuid, data);
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

const getBranches = (event, uuid, data) => {
  simpleGit.cwd(data.path).branchLocal((err, branchInfo) => {
    if (err) {
      asynchronousReply(event, uuid, {});
      return;
    }
    asynchronousReply(event, uuid, { branches: branchInfo.branches });
  });
};

const getBranchInfo = (event, uuid, data) => {
  let branchData = [];
  let logCollectorFunctions = [];
  simpleGit.cwd(data.path).branchLocal((branchInfoError, branchInfo) => {
    if (branchInfoError) {
      return;
    }
    branchInfo.all.forEach((branchName) => {
      logCollectorFunctions.push((callback) => {
        simpleGit.checkout(branchName, (checkoutError) => {
          if (!checkoutError) {
            simpleGit.log({ "-n10": null }, (logError, logInfo) => {
              if (!logError) {
                branchData.push({
                  branch: branchName,
                  logs: logInfo.all,
                  index: 0,
                });
                callback();
              }
            });
          }
        });
      });
    });
    async.waterfall(logCollectorFunctions, () => {
      asynchronousReply(event, uuid, {
        branchName: data.branchName,
        logs: branchData,
      });
    });
  });
};

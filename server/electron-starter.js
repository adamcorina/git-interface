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

  mainWindow.setMinimumSize(1000, 700);

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
  dialog.showOpenDialog(mainWindow, { properties: ["openDirectory"] }).then((directory) => {
    onDirectorySelected(event, uuid, directory);
  });
};

const getBranches = (event, uuid, data) => {
  simpleGit.cwd(data.path).branchLocal((err, branchInfo) => {
    if (err) {
      asynchronousReply(event, uuid, {});
      return;
    }
    asynchronousReply(event, uuid, {
      branches: branchInfo.all,
      current: branchInfo.current,
    });
  });
};

const getLogsForBranches = (branches, firstCommitDate, lastCommitDate, getLogsForBranchesCallback) => {
  let logCollectorFunctions = [];
  let branchesData = [];

  branches.forEach((branchName) => {
    logCollectorFunctions.push((callback) => {
      simpleGit.checkout(branchName, (checkoutError) => {
        if (!checkoutError) {
          // , "--before": lastCommitDate
          simpleGit.log({ "--after": firstCommitDate }, (logError, logInfo) => {
            if (!logError && logInfo.all.length) {
              branchesData.push({ branch: branchName, logs: logInfo.all, index: 0 });
              callback();
            }
          });
        }
      });
    });
  });
  async.waterfall(logCollectorFunctions, () => {
    getLogsForBranchesCallback(branchesData);
  });
};

const mergeLogs = (branchesData) => {
  let mergedLogs = {};
  let done = false;
  let activeBranches = [];

  while (!done) {
    done = true;
    let latestCommit = null;
    let latestCommitBranchIndex = null;

    branchesData.forEach((branchData, branchIndex) => {
      if (
        branchData.logs[branchData.index] &&
        (!latestCommit ||
          new Date(latestCommit.date) < new Date(branchData.logs[branchData.index].date) ||
          (new Date(latestCommit.date).getTime() === new Date(branchData.logs[branchData.index].date).getTime() &&
            activeBranches.indexOf(branchData.branch) !== -1 &&
            activeBranches.indexOf(latestCommit.branch) !== -1 &&
            activeBranches.indexOf(branchData.branch) <
              activeBranches.indexOf(latestCommit.branch)) ||
          (new Date(latestCommit.date).getTime() === new Date(branchData.logs[branchData.index].date).getTime() &&
            activeBranches.indexOf(branchData.branch) !== -1 &&
            activeBranches.indexOf(latestCommit.branch) === -1))
      ) {
        latestCommit = { ...branchData.logs[branchData.index], branch: branchData.branch };
        latestCommitBranchIndex = branchIndex;
      }
    });
    if (latestCommitBranchIndex !== null) {
      done = false;
      if (activeBranches.indexOf(branchesData[latestCommitBranchIndex].branch) === -1) {
        activeBranches.push(branchesData[latestCommitBranchIndex].branch);
      }
      branchesData[latestCommitBranchIndex].index++;
      if (!mergedLogs[latestCommit.hash]) {
        mergedLogs[latestCommit.hash] = [];
      }
      mergedLogs[latestCommit.hash] = [
        ...mergedLogs[latestCommit.hash],
        { ...latestCommit, branch: branchesData[latestCommitBranchIndex].branch },
      ];
    }
  }
  return { mergedLogs, activeBranches };
};

const getBranchInfo = (event, uuid, data) => {
  let branchesData = [];
  simpleGit.cwd(data.path).branchLocal((branchInfoError, branchInfo) => {
    if (branchInfoError) {
      return;
    }
    simpleGit.checkout(data.branchName, (selectedBranchCheckoutError) => {
      if (!selectedBranchCheckoutError) {
        simpleGit.log({ "-n40": null }, (selectedBranchLogError, selectedBranchLogInfo) => {
          if (!selectedBranchLogError) {
            branchesData.push({ branch: data.branchName, logs: selectedBranchLogInfo.all, index: 0 });

            const lastCommitDate = selectedBranchLogInfo.all[0].date;
            const firstCommitDate = selectedBranchLogInfo.all[selectedBranchLogInfo.all.length - 1].date;
            const localBranchesWithoutSelected = branchInfo.all.filter((branchName) => branchName !== data.branchName);

            getLogsForBranches(localBranchesWithoutSelected, firstCommitDate, lastCommitDate, (results) => {
              branchesData = branchesData.concat(results);
              const mergedBranchesData = mergeLogs(branchesData);
              asynchronousReply(event, uuid, {
                branchName: data.branchName,
                logs: mergedBranchesData.mergedLogs,
                branches: [data.branchName, []],
                activeBranches: mergedBranchesData.activeBranches,
              });
            });
          }
        });
      }
    });
  });
};

const uuid4 = require("uuid4");
const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

const callCache = {};

ipcRenderer.on("asynchronous-reply", (event, arg) => {
  if (arg.uuid && callCache[arg.uuid]) {
    const { resolve } = callCache[arg.uuid];
    resolve(arg.data);
    delete callCache[arg.uuid];
  }
});

function createPromise(_resolve, _reject) {
  const promise = new Promise(function (resolve, reject) {});

  promise.resolve = _resolve;
  promise.reject = _reject;

  return promise;
}

export default function callService(messageType, data) {
  let duplicateRequestUUID = null;
  Object.entries(callCache).forEach((cacheEntry) => {
    if (cacheEntry[1].messageType === messageType && JSON.stringify(cacheEntry[1].data) === JSON.stringify(data)) {
      duplicateRequestUUID = cacheEntry[0];
    }
  });
  if (duplicateRequestUUID) {
    return createPromise(callCache[duplicateRequestUUID].resolve, callCache[duplicateRequestUUID].reject);
  }
  const uuid = uuid4(); //generate the unique call id
  const promise = new Promise((resolve, reject) => {
    callCache[uuid] = {
      resolve,
      reject,
      data,
      messageType
    };
  });
  ipcRenderer.send("asynchronous-message", { uuid, messageType, data });
  return promise;
}

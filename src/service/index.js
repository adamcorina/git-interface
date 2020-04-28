const uuid4 = require('uuid4');
const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer

const callCache = {}

ipcRenderer.on('asynchronous-reply', (event, arg) => {
    const { resolve } = callCache[arg.uuid]
    resolve(arg.data)
    delete callCache[arg.uuid]
})

export default function callService(messageType, data) {
    const uuid = uuid4() //generate the unique call id
    const promise = new Promise((resolve, reject) => {
        callCache[uuid] = {
            resolve,
            reject,
            data
        }
    })
    ipcRenderer.send('asynchronous-message', { uuid, messageType, data })
    return promise;
}
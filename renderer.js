// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { event_keys } = require('./constants')

const ipc = require('electron').ipcRenderer

const { dialog } = require('electron').remote
// console.log(dialog)

const openDialog = () => {
    dialog.showOpenDialog({properties: ['openFile']}, function (paths) {
        console.log(paths)

        ipc.send(event_keys.GET_INPUT_PATH, paths[0])

    })
}
const asyncMsgBtn = document.getElementById('async-msg')

asyncMsgBtn.addEventListener('click', function () {
    openDialog()
})


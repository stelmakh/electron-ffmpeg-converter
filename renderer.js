// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { event_keys } = require('./constants')

const ipc = require('electron').ipcRenderer

const { dialog } = require('electron').remote
// console.log(dialog)

const selectDirButton = document.getElementById('select-dir')
const selectedDirPath = document.getElementById('selected-dir-path')
const selectFileButton = document.getElementById('select-file')

const progress = document.getElementById('progress')
const message = document.getElementById('message')

const openDialog = () => {
    dialog.showOpenDialog({properties: ['openFile']}, function (paths) {
        console.log(paths)

        ipc.send(event_keys.GET_INPUT_PATH, paths[0])

    })
}

const openDirDialog = () => {
    dialog.showOpenDialog({properties: ['openDirectory', 'createDirectory']}, function (paths) {
        console.log(paths)

        selectedDirPath.innerText = paths[0]
        ipc.send(event_keys.SET_OUTPUT_PATH, paths[0])

    })
}
selectDirButton.addEventListener('click', function () {
    openDirDialog()
})

selectFileButton.addEventListener('click', function () {
    openDialog()
})

ipc.on(event_keys.SET_PROGRESS, (event, arg) => {
    progress.value = arg
})

ipc.on(event_keys.SUCCESS, (event, arg) => {
    message.innerText = 'SUCCESS'
})

ipc.on(event_keys.FAILURE, (event, arg) => {
    message.innerText = 'Error: ' + arg
})

const ipc = require('electron').ipcRenderer;
const { eventKeys } = require('./constants');

window.addEventListener('DOMContentLoaded', () => {
  const selectDirButton = document.getElementById('select-dir');
  const selectedDirPath = document.getElementById('selected-dir-path');
  const selectFileButton = document.getElementById('select-file');

  const progress = document.getElementById('progress');
  const message = document.getElementById('message');

  selectDirButton.addEventListener('click', () => {
    ipc.send(eventKeys.OPEN_OUT_DIR_DIALOG);
  });

  selectFileButton.addEventListener('click', () => {
    ipc.send(eventKeys.OPEN_FILE_DIALOG);
  });

  ipc.on(eventKeys.SET_OUTPUT_PATH, (event, arg) => {
    selectedDirPath.innerText = arg;
  });

  ipc.on(eventKeys.SET_PROGRESS, (event, arg) => {
    progress.value = arg;
  });

  ipc.on(eventKeys.SUCCESS, () => {
    message.innerText = 'SUCCESS';
  });

  ipc.on(eventKeys.FAILURE, (event, arg) => {
    message.innerText = `Error: ${arg}`;
  });
});

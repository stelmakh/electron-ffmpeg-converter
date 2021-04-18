const ipc = require('electron').ipcRenderer;
const { eventKeys } = require('./constants');

window.addEventListener('DOMContentLoaded', () => {
  const selectDirButton = document.getElementById('select-dir');
  const selectedDirPath = document.getElementById('selected-dir-path');
  const selectFileButton = document.getElementById('select-file');
  const selectedFilePath = document.getElementById('selected-file-path');

  const convertButton = document.getElementById('convert');
  const clearButton = document.getElementById('clear');

  const progress = document.getElementById('progress');
  const message = document.getElementById('message');

  selectDirButton.addEventListener('click', () => {
    ipc.send(eventKeys.OPEN_OUT_DIR_DIALOG);
  });

  selectFileButton.addEventListener('click', () => {
    ipc.send(eventKeys.OPEN_FILE_DIALOG);
  });

  convertButton.addEventListener('click', () => {
    ipc.send(eventKeys.CONVERT_VIDEO_TO_IMAGE);
  });

  clearButton.addEventListener('click', () => {
    ipc.send(eventKeys.CLEAR);
    progress.style.visibility = 'hidden';
    convertButton.style.visibility = 'hidden';
    clearButton.style.visibility = 'hidden';
    selectedDirPath.innerText = '';
    selectedFilePath.innerText = '';
    message.innerText = '';
  });

  ipc.on(eventKeys.SET_OUTPUT_PATH, (event, arg) => {
    selectedDirPath.innerText = arg;
  });

  ipc.on(eventKeys.SET_FILE_PATH, (event, arg) => {
    selectedFilePath.innerText = arg;
  });

  ipc.on(eventKeys.READY, () => {
    convertButton.style.visibility = 'visible';
    clearButton.style.visibility = 'visible';
  });

  ipc.on(eventKeys.SET_PROGRESS, (event, arg) => {
    progress.style.visibility = 'visible';
    progress.value = arg;
  });

  ipc.on(eventKeys.SUCCESS, () => {
    progress.style.visibility = 'hidden';
    message.innerText = 'SUCCESS';
  });

  ipc.on(eventKeys.FAILURE, (event, arg) => {
    progress.style.visibility = 'hidden';
    message.innerText = `Error: ${arg}`;
  });
});

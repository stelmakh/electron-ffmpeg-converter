const ipc = require('electron').ipcRenderer;
const { eventKeys } = require('./constants');

window.addEventListener('DOMContentLoaded', () => {
  const selectDirButton = document.getElementById('select-dir');
  const selectedDirPath = document.getElementById('selected-dir-path');
  const selectFileButton = document.getElementById('select-file');
  const selectedFilePath = document.getElementById('selected-file-path');

  const toggleModeButton = document.getElementById('toggle-mode');

  const convertButton = document.getElementById('convert');
  const clearButton = document.getElementById('clear');

  const progress = document.getElementById('progress');
  const message = document.getElementById('message');
  const fileSection = document.getElementById('file-section');

  const v2i = document.getElementById('v2i');
  const i2v = document.getElementById('i2v');

  const clear = () => {
    ipc.send(eventKeys.CLEAR);
    progress.style.visibility = 'hidden';
    convertButton.style.visibility = 'hidden';
    clearButton.style.visibility = 'hidden';
    selectedDirPath.innerText = '';
    selectedFilePath.innerText = '';
    message.innerText = '';
  };

  toggleModeButton.addEventListener('click', () => {
    if (v2i.style.display === 'block') {
      // switch to image2video
      v2i.style.display = 'none';
      i2v.style.display = 'block';
      fileSection.style.display = 'none';
    } else {
      // switch to video2image
      v2i.style.display = 'block';
      i2v.style.display = 'none';
      fileSection.style.display = 'block';
    }
    ipc.send(eventKeys.TOGGLE_MODE);
    clear();
  });

  selectDirButton.addEventListener('click', () => {
    ipc.send(eventKeys.OPEN_OUT_DIR_DIALOG);
  });

  selectFileButton.addEventListener('click', () => {
    ipc.send(eventKeys.OPEN_FILE_DIALOG);
  });

  convertButton.addEventListener('click', () => {
    if (v2i.style.display === 'block') {
      // video2image mode
      ipc.send(eventKeys.CONVERT_VIDEO_TO_IMAGE);
    } else {
      // image2video mode
      ipc.send(eventKeys.CONVERT_IMAGE_TO_VIDEO);
    }
  });

  clearButton.addEventListener('click', () => {
    clear();
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

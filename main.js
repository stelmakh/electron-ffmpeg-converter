const {
  app, BrowserWindow, dialog, nativeTheme, ipcMain: ipc,
} = require('electron');

const path = require('path');

const ffmpeg = require('fluent-ffmpeg');

const { eventKeys, paths } = require('./constants');

ffmpeg.setFfmpegPath(paths.ffmpeg);
ffmpeg.setFfprobePath(paths.ffprobe);

// create main window
function createWindow() {
  nativeTheme.themeSource = 'light';
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('index.html');
  // win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// app state
let dirPath = null;
let filePath = null;
let mode = 'v2i';

// handle mode change
ipc.on(eventKeys.TOGGLE_MODE, () => {
  mode = mode === 'v2i' ? 'i2v' : 'v2i';
});

// open file selection dialog
ipc.on(eventKeys.OPEN_FILE_DIALOG, (event) => {
  dialog.showOpenDialog({ properties: ['openFile'] }).then(({ canceled, filePaths }) => {
    if (canceled) return;

    filePath = filePaths[0];
    event.reply(eventKeys.SET_FILE_PATH, filePath);
    event.reply(eventKeys.READY);
  });
});

// open directory selection dialog
ipc.on(eventKeys.OPEN_OUT_DIR_DIALOG, (event) => {
  dialog.showOpenDialog({ properties: ['openDirectory', 'createDirectory', 'promptToCreate'] }).then(({ canceled, filePaths }) => {
    if (canceled) return;

    dirPath = filePaths[0];
    event.reply(eventKeys.SET_OUTPUT_PATH, dirPath);
    if (mode === 'i2v') {
      event.reply(eventKeys.READY);
    }
  });
});

// run video to images conversion
ipc.on(eventKeys.CONVERT_VIDEO_TO_IMAGE, (event) => {
  if (!filePath) {
    return;
  }

  try {
    event.reply(eventKeys.SET_PROGRESS, 10);
    ffmpeg(filePath)
      .on('codecData', (data) => {
        console.log(data);
      })
      .on('end', () => {
        console.log('file has been converted succesfully');
        event.reply(eventKeys.SUCCESS);
      })
      .on('error', (err) => {
        console.log(`an error happened: ${err.message}`);
        event.reply(eventKeys.FAILURE, err.message);
      })
      .on('progress', ({ percent }) => {
        console.log(`progress percent: ${percent}`);
        event.reply(eventKeys.SET_PROGRESS, percent);
      })
      .output(`${dirPath}/image%d.jpg`)
      .run();
  } catch (error) {
    event.reply(eventKeys.FAILURE, error);
  }
});

// run images to video conversion
ipc.on(eventKeys.CONVERT_IMAGE_TO_VIDEO, (event) => {
  if (!dirPath) {
    return;
  }

  try {
    event.reply(eventKeys.SET_PROGRESS, 10);
    ffmpeg(`${dirPath}/image%d.jpg`)
      .on('codecData', (data) => {
        console.log(data);
      })
      .on('end', () => {
        console.log('file has been converted succesfully');
        event.reply(eventKeys.SUCCESS);
      })
      .on('error', (err) => {
        console.log(`an error happened: ${err.message}`);
        event.reply(eventKeys.FAILURE, err.message);
      })
      .on('progress', ({ percent }) => {
        console.log(`progress percent: ${percent}`);
        event.reply(eventKeys.SET_PROGRESS, percent);
      })
      .output(`${dirPath}/video.mp4`)
      .run();
  } catch (error) {
    event.reply(eventKeys.FAILURE, error);
  }
});
ipc.on(eventKeys.CLEAR, () => {
  dirPath = null;
  filePath = null;
});

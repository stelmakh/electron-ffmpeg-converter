const {
  app, BrowserWindow, dialog, nativeTheme, ipcMain: ipc,
} = require('electron');

const path = require('path');

const ffmpeg = require('fluent-ffmpeg');

const { eventKeys, paths } = require('./constants');

ffmpeg.setFfmpegPath(paths.ffmpeg);
ffmpeg.setFfprobePath(paths.ffprobe);

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
  win.webContents.openDevTools();
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

let outPath = null;

ipc.on(eventKeys.OPEN_FILE_DIALOG, (event) => {
  dialog.showOpenDialog({ properties: ['openFile'] }).then(({ canceled, filePaths }) => {
    if (canceled) return;

    const filePath = filePaths[0];
    try {
      const { dir } = path.parse(filePath);
      const outDir = outPath || dir;

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
        .output(`${outDir}/image%d.jpg`)
        .run();
    } catch (error) {
      event.reply(eventKeys.FAILURE, error);
    }
  });
});

ipc.on(eventKeys.OPEN_OUT_DIR_DIALOG, (event) => {
  dialog.showOpenDialog({ properties: ['openDirectory', 'createDirectory', 'promptToCreate'] }).then(({ canceled, filePaths }) => {
    if (canceled) return;

    [outPath] = filePaths;
    event.reply(eventKeys.SET_OUTPUT_PATH, outPath);
  });
});

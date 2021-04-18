const ffmpeg = require('ffmpeg-static-electron');
const ffprobe = require('ffprobe-static-electron');

// configure ffmpeg and ffprobe binaries paths
const paths = {
  ffmpeg: ffmpeg.path,
  ffprobe: ffprobe.path,
};

const eventKeys = {
  TOGGLE_MODE: 'TOGGLE_MODE',
  SET_FILE_PATH: 'SET_FILE_PATH',
  SET_OUTPUT_PATH: 'SET_OUTPUT_PATH',
  OPEN_FILE_DIALOG: 'OPEN_FILE_DIALOG',
  OPEN_OUT_DIR_DIALOG: 'OPEN_OUT_DIR_DIALOG',
  CONVERT_VIDEO_TO_IMAGE: 'CONVERT_VIDEO_TO_IMAGE',
  CONVERT_IMAGE_TO_VIDEO: 'CONVERT_IMAGE_TO_VIDEO',
  READY: 'READY',
  CLEAR: 'CLEAR',
  SET_PROGRESS: 'SET_PROGRESS',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
};

module.exports = {
  eventKeys,
  paths,
};

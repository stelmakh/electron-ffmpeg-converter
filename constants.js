var ffmpeg = require('ffmpeg-static-electron');
var ffprobe = require('ffprobe-static-electron');

// configure ffmpeg and ffprobe binaries paths
const paths = {
    ffmpeg: ffmpeg.path,
    ffprobe: ffprobe.path
}

const eventKeys = {
    GET_INPUT_PATH: 'GET_INPUT_PATH',
    SET_OUTPUT_PATH: 'SET_OUTPUT_PATH',
    OPEN_FILE_DIALOG: 'OPEN_FILE_DIALOG',
    OPEN_OUT_DIR_DIALOG: 'OPEN_OUT_DIR_DIALOG',
    SET_PROGRESS: 'SET_PROGRESS',
    SUCCESS: 'SUCCESS',
    FAILURE: 'FAILURE',
}


module.exports = {
    eventKeys,
    paths
}
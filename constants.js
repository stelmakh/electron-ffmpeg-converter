var ffmpeg = require('ffmpeg-static-electron');
var ffprobe = require('ffprobe-static-electron');

// configure ffmpeg and ffprobe binaries paths
const paths = {
    ffmpeg: ffmpeg.path,
    ffprobe: ffprobe.path
}

const event_keys = {
    GET_INPUT_PATH: 'GET_INPUT_PATH',
    SET_OUTPUT_PATH: 'SET_OUTPUT_PATH',
    SHOW_DIALOG: 'SHOW_DIALOG',
    SET_PROGRESS: 'SET_PROGRESS',
    SUCCESS: 'SUCCESS',
    FAILURE: 'FAILURE',
}


module.exports = {
    event_keys,
    paths
}
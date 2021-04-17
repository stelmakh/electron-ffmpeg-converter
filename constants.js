var ffmpeg = require('ffmpeg-static-electron');
var ffprobe = require('ffprobe-static-electron');

// configure ffmpeg and ffprobe binaries paths
const paths = {
    ffmpeg: ffmpeg.path,
    ffprobe: ffprobe.path
}

const event_keys = {
    GET_INPUT_PATH: 'GET_INPUT_PATH',
    SHOW_DIALOG: 'SHOW_DIALOG'
}


module.exports = {
    event_keys,
    paths
}
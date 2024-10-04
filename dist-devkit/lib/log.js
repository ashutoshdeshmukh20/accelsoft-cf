"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debug = exports.setLogLevel = void 0;
var logLevel = 1;
function setLogLevel(level) {
    logLevel = level;
}
exports.setLogLevel = setLogLevel;
function debug(msg) {
    if (logLevel > 0) {
        console.log(msg);
    }
}
exports.debug = debug;

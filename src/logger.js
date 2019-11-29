'use strict';
const EventLogger = require('node-windows').EventLogger;

let logger = console;
if (process.env.NODE_ENV === 'service') {
    logger = new EventLogger("Dsn-Proxy");
}

exports.info = function (message) {
    logger.info(message);
}

exports.warn = function (message) {
    logger.warn(message);
}

exports.error = function (message) {
    logger.error(message);
}
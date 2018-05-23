"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
exports.ROOT = path.resolve(__dirname);
exports.root = function () {
    var segments = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        segments[_i] = arguments[_i];
    }
    return path.resolve.apply(path, [exports.ROOT].concat(segments));
};
exports.normalizePort = function (val) {
    var port = parseInt(val);
    if (isNaN(port)) { // is a named pipe
        return val;
    }
    if (port >= 0) { // port is a number
        return port;
    }
    return undefined;
};
//# sourceMappingURL=helpers.js.map
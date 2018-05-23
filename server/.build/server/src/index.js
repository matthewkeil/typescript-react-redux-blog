"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser");
var compression = require("compression");
var cookieParser = require("cookie-parser");
var cors = require("cors");
var express = require("express");
var session = require("express-session");
var helmet = require("helmet");
var http = require("http");
var mongodb_1 = require("mongodb");
var morgan = require("morgan");
var helpers_1 = require("./helpers");
var mongoStore;
var app = express();
var PORT = helpers_1.normalizePort(process.env.API_PORT || 3001);
var DB_URL = process.env.DB_URL || 'mongodb://localhost:27017';
var DB_NAME = process.env.DB_NAME || 'typescript-react-redux-blog';
var MS = require('connect-mongo')(session);
mongodb_1.MongoClient.connect(DB_URL, function (err, client) {
    if (err || !client) {
        console.error(err || new Error('no mongo client connection'));
        process.exit(1);
    }
    console.log("Connected to mongodb at " + DB_URL + "/" + DB_NAME);
    exports.db = client.db(DB_NAME);
    mongoStore = new MS({ db: exports.db });
    app.set('port', PORT);
    app.use(helmet());
    app.get(/.*favicon.ico/, function (req, res) { return res.end(); });
    app.use(morgan('dev'));
    app.use(cors({
        origin: '*',
        exposedHeaders: ['Link']
    }));
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(session({
        secret: process.env.SESSION_SECRET || 'SessionSecretShhhSilly....',
        saveUninitialized: true,
        resave: true,
        store: mongoStore
    }));
    app.use(compression());
    // app.use(authRouter);
    // app.use(authentication);
    // app.use(router);
    app.use(function (req, res, next) { return res.status(200).send('<h1>OK IT WORKS</h1>'); });
    var server = http.createServer(app);
    server.on('close', function () { return client.close(); });
    process.on('exit', function () { return client.close().then(function () { return server.close(); }); });
    server.listen(PORT, function () { return console.log('Listening on port', PORT); });
});
//# sourceMappingURL=index.js.map
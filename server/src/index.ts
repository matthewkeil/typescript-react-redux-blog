import * as bodyParser   from 'body-parser';
import * as compression  from 'compression';
import {MongoStore}      from 'connect-mongo';
import * as cookieParser from 'cookie-parser';
import * as cors         from 'cors';
import * as express      from 'express';
import * as session      from 'express-session';
import * as helmet       from 'helmet';
import * as http         from 'http';
import {
    Db,
    MongoClient
}                        from 'mongodb';
import * as morgan       from 'morgan';

import {normalizePort} from './helpers';



export let db: Db;
let mongoStore: MongoStore;

const app             = express();
const PORT            = normalizePort(process.env.API_PORT || 3001);
const DB_URL: string  = process.env.DB_URL || 'mongodb://localhost:27017';
const DB_NAME: string = process.env.DB_NAME || 'typescript-react-redux-blog';
const MS              = require('connect-mongo')(session);


MongoClient.connect(DB_URL, (err: Error, client: MongoClient) => {

    if (err || !client) {
        console.error(err || new Error('no mongo client connection'));
        process.exit(1);
    }

    console.log(`Connected to mongodb at ${DB_URL}/${DB_NAME}`);
    db         = client.db(DB_NAME);
    mongoStore = new MS({db});


    app.set('port', PORT);
    app.use(helmet());
    app.get(/.*favicon.ico/, (req, res) => res.end());
    app.use(morgan('dev'));
    app.use(cors({
        origin        : '*',
        exposedHeaders: ['Link']
    }));
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(session({
        secret           : process.env.SESSION_SECRET || 'SessionSecretShhhSilly....',
        saveUninitialized: true,
        resave           : true,
        store            : mongoStore
    }));
    app.use(compression());
    // app.use(authRouter);
    // app.use(authentication);
    // app.use(router);
    app.use((req, res, next) => res.status(200).send('<h1>OK IT WORKS</h1>'));

    const server = http.createServer(app);

    server.on('close', () => client.close());

    process.on('exit', () => client.close().then(() => server.close()));

    server.listen(PORT, () => console.log('Listening on port', PORT));
});

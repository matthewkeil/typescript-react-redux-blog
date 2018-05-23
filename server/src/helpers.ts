import * as path from 'path';

export const ROOT = path.resolve(__dirname);

export const root = (...segments: string[]): string => path.resolve(ROOT, ...segments);

export const normalizePort = (val: any) => {

    let port = parseInt(val);

    if (isNaN(port)) { // is a named pipe
        return val;

    }

    if (port >= 0) {   // port is a number
        return port;

    }

    return undefined;
};


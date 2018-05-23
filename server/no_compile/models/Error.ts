import {isError} from 'util';



export class ApiError extends Error {

    public error?: Error;
    public other?: any[];

    constructor(message: string, ...args: any[]) {
        super(message);

        args.forEach(arg => {
           if (isError(arg)) this.error = arg;
        });
    }
}
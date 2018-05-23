import * as bcrypt from 'bcrypt';
import * as jwt    from 'jsonwebtoken';
import {
    SignOptions,
    VerifyOptions
}                  from 'jsonwebtoken';
import * as util   from 'util';


import {db} from '../../src/index';
//
// import {
//     TokenPayload,
//     Token
// }                       from '../../../client/src/models/Auth';
// import {SerializedUser} from '../../../client/src/models/User';
//



const JWT_SECRET = process.env.JWT_SECRET || 'shhh...itsasecret';


export const Users = () => db.collection(User.collectionName);

export class User {

    static collectionName = 'users';

    static find = {
        by       : {
            id   : (id: string): Promise<SerializedUser> => Users().findOne({id}),
            email: (email: string): Promise<SerializedUser> => Users().findOne({email})
        },
        duplicate: {
            email: (email: string | string[]) => <Promise<SerializedUser[]>>Users().find(!util.isArray(email)
                ? {email}
                : {email: {$in: email}}).toArray()
        }
    };

    static update = async (id: string, update: any): Promise<SerializedUser> => {
        let result = await Users().findOneAndUpdate({id}, update, {returnOriginal: false});
        if (result.ok === 1) return result.value;
        throw new Error('Unknown error updating user');
    };

    static jwt = {
        encode: (payload: TokenPayload): Promise<Token> => {
            //@ts-ignore
            const ENCODE = util.promisify(jwt.sign);

            const options: SignOptions = {
                issuer   : 'BayIslandsGoBlue',
                expiresIn: 60 * 60 * 24 * 365 // tokens expire in one year
            };
            //@ts-ignore
            return ENCODE(payload, JWT_SECRET, options);
        },
        decode: (token: Token): Promise<TokenPayload> => {
            //@ts-ignore
            const DECODE = util.promisify(jwt.verify);

            const options: VerifyOptions = {
                issuer: 'BayIslandsGoBlue'
            };
            //@ts-ignore
            return DECODE(token, JWT_SECRET, options);
        }
    };

    static password = {
        hash  : (password: string): Promise<string> => {
            return bcrypt.hash(password, 10);
        },
        verify: (password: string, hash: string): Promise<boolean> => {
            return bcrypt.compare(password, hash);
        }
    };
}
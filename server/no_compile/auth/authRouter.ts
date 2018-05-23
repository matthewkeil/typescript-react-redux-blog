import * as express from 'express';
import {
    User,
    Users
}                   from '../models/index';

import {
    ValidEmail,
    ValidPassword
} from './index';



export type AuthToken = string;


import uuid = require('uuid');
import shortid = require('shortid');



const authRouter = express.Router();

authRouter.post('/auth/login', async (req, res, next) => {
    try {
        let user;

        if (req.body && req.body.email && ValidEmail.test(req.body.email)) {
            user = await User.find.by.email(req.body.email);
        } else return res.status(400).send({error: {message: 'Invalid email address'}});


        if (!user || (user && !User.password.verify(req.body.password || '', user.password))) {
            return res.status(401).send({error: {message: 'Invalid email or password'}});
        }

        const token = await User.jwt.encode({email: user.email, id: user.id});

        await User.update(user.id, {$set: {token}});

        if (user.password) delete user.password;
        if (user._id) delete user._id;

        return res.status(201).send(<User>user);

    } catch (err) {
        next(err);
    }
});

authRouter.post('/auth/register', async (req, res, next) => {
    try {
        let email: string;

        if (req.body && req.body.email && ValidEmail.test(req.body.email)) email = req.body.email;
        else return res.status(400).send({error: {message: 'Invalid email address'}});

        const existingUsers = await User.find.duplicate.email(email);

        console.log(existingUsers);

        if (existingUsers) switch (existingUsers.length) {
            case 0:
                break;
            case 1:
                return res.status(401).send({error: {message: 'Email account in use'}});
            default:
                return next(new Error('Multiple accounts exist with one email address'));
        }

        if (!ValidPassword.test(req.body.password)) return res.status(400).send({error: {message: 'Invalid password'}});

        const id = shortid.generate();

        const user = {
            id      : id,
            email   : email,
            password: await User.password.hash(req.body.password),
            token   : await User.jwt.encode({email, id})
        };

        const result = await Users().insertOne(user);

        delete user.password;

        if (result.result.ok === 1) return res.status(201).send(<User>user);
        else return next(new Error('Unknown error creating new user'));

    } catch (err) {
        next(err);
    }
});

export {authRouter};
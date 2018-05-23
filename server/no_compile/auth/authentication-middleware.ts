import {User}         from '../models/index';
import {TokenPayload} from '../models/User';



export const authentication = async (req, res, next) => {

    try {
        const header = req.header('Authentication');
        let payload: TokenPayload;

        header
            ? payload = await User.jwt.decode(header.split(' ')[1])
            : res.status(401).end();

        const user = await User.find.by.id(payload.id);

        if (!user) res.status(401).end();

        (<any>req).user = user;

        next();

    } catch (err) {
        next(err);
    }
};
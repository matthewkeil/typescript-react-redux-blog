import * as express      from 'express';
import {db}              from '../src/index';
import {collectionNames} from './models/index';
import shortid = require('shortid');



const getCollection = (req: express.Request, res: express.Response) => {
    const model = req.params.model;

    let found = false;
    collectionNames.forEach(name => {
        found = found || model === name;
    });
    if (!found) res.status(400).end();

    return db.collection(model);
};

const getItem = (fromId: boolean = true) => async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    try {
        let key: string,
            value: string;

        if (fromId) {
            key   = 'id';
            value = req.params.id;
        } else {
            key   = req.params.key;
            value = req.params.value;
        }

        let item: any = await getCollection(req, res).findOne({[key]: value});

        if (item.hasOwnProperty('_id')) delete (<any>item)._id;
        if (item.hasOwnProperty('password')) delete (<any>item).password;

        item
            ? res.status(200).json(item)
            : res.status(404).end();

    } catch (err) {
        next(err);
    }
};

const router = express.Router();

router.get('/:model', async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    try {
        res.status(200).json(await getCollection(req, res).find().toArray());
    } catch (err) {
        next(err);
    }
});

router.get('/:model/:id', getItem(true));

router.get('/:model/:key/:value', getItem(false));

router.post('/:model/:id', async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    try {
        const collection = getCollection(req, res);
        const item       = <{id: string}>{...(req.body || {id: ''})};
        const checkAndInsert= async () => {

            let idExists = await collection.findOne({id: item.id});

            let result;
            if (!idExists) result = await collection.insertOne(item);
            else {
                item.id = shortid.generate();
                result  = await checkAndInsert();
            }

            result.result.ok === 1
                ? res.status(201).json(item)
                : res.status(500).end();
        }
    } catch (err) {
        next(err);
    }
});

router.put('/:model/:id', async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    try {
        const item   = {...(req.body || {})};
        const result = await getCollection(req, res).replaceOne({id: req.params.id}, item);
        result.result.ok === 1
            ? res.status(200).json(item)
            : res.status(500).end();
    } catch (err) {
        next(err);
    }
});

router.delete('/:model/:id', async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    try {
        const result = await getCollection(req, res).deleteOne({id: req.params.id});
        result.result.ok === 1
            ? res.status(200).send(req.params.id)
            : res.status(500).end();
    } catch (err) {
        next(err);
    }
});

export {router};
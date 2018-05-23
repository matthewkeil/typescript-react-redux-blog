var mongodb = require('mongo-mock');


module.exports = (function () {
    const MongoClient = mongodb.MongoClient;
    MongoClient.persists = './mock.db.json';
    return function cleanUp() {

    }
})();
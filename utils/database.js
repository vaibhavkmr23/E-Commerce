const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;


const mongoConnect = callback => {
    MongoClient.connect('mongodb+srv://Vaibhav:23101995@cluster0.gsxn3bf.mongodb.net/?retryWrites=true&w=majority')
        .then(client => {
            console.log("Connected!!");
            callback(client);
        })
        .catch(err => {
            console.log(err);
        });
};

module.exports = mongoConnect;

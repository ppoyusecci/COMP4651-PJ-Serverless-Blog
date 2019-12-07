"use strict"

const MongoClient = require('mongodb').MongoClient
, assert = require('assert');
const fs = require('fs');

var clientsDB;  // Cached connection-pool for further requests.

module.exports = (event, context) => {
    prepareDB()
    .then((users) => {
        const record = {"content": event.body };

        users.collection("posts").insertOne(record, (insertErr) => {
            if(insertErr) {
                return context.fail(insertErr.toString());
            }

            const result =  {
                status: "Insert done of: " + JSON.stringify(event.body)
            };
    
            context
                .status(200)
                .succeed(result);
        });
    })
    .catch(err => {
        context.fail(err.toString());
    });
}

const prepareDB = () => {
    var pwd = fs.readFileSync('/var/openfaas/secrets/mongodb-client-pwd', 'utf8');
    const url = "mongodb://userclients:" + pwd + "@" + process.env.mongo + ":27017/clients"

    return new Promise((resolve, reject) => {
        if(clientsDB) {
            console.error("DB already connected.");
            return resolve(clientsDB);
        }

        console.error("DB connecting");

        MongoClient.connect(url, (err, database) => {
            if(err) {
                return reject(err)
            }
    
            clientsDB = database.db("clients");
            return resolve(clientsDB)
        });
    });
}
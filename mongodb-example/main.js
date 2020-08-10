const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const url = "mongodb://localhost:27017/";
const dbName = "mongodb-example";
const collection = "example-collection";

MongoClient.connect(url, (err, client) => {
    if (err) return console.log(err);
    db = client.db(dbName);
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next){
    console.log('Time: ', Date.now());
    console.log('Request Type: ', req.method);
    next();
});

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get('/api', (req, res) => {
    db.collection(collection).find().toArray((err, results) => {
        if (err) return res.send(500, err);
        res.json(results);
    });
});

app.post('/api', function (req, res) {
    db.collection(collection).insertOne(req.body, (err, result) => {
        if (err) return res.send(500, err);
        res.sendStatus(200)
    });
});

app.put('/api/:id', function (req, res) {
    var id = req.params.id;
    db.collection(collection).updateOne({_id: ObjectID(id)}, {$set:req.body}, (err, result) => {
        if (err) return res.send(500, err);
        res.sendStatus(200)
    });
});

app.delete('/api/:id', function (req, res) {
    var id = req.params.id;
    db.collection(collection).deleteOne({_id: ObjectID(id)}, (err, result) => {
        if (err) return res.send(500, err);
        res.sendStatus(200)
    });
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
})
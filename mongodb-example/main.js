var express = require('express');
var app = express();
const port = 3000;

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var db = "mongodb-example";
var collection = "example-collection";

const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

MongoClient.connect(url, (err, client) => {
    if (err) return console.log(err);
    db = client.db(db);
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

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
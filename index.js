const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ibcuh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(cors());
app.use(bodyParser.json());

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const eventCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection('events');

  const registeredListCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection('registeredlist');

  app.post('/addEvent', (req, res) => {
    eventCollection.insertMany(req.body).then((result) => {
      res.send(result.insertedCount.toString());
    });
  });
  app.get('/events', (req, res) => {
    eventCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.get('/event/:id', (req, res) => {
    eventCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });
  app.post('/getEventsByKeys', (req, res) => {
    eventCollection
      .find({ _id: { $in: req.body.map((id) => ObjectId(id)) } })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });
  app.post('/addUserEvent', (req, res) => {
    registeredListCollection.insertOne(req.body).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  app.get('/getUserEvents/:name', (req, res) => {
    registeredListCollection
      .find({ name: req.params.name })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });
  app.delete('/deleteUserEvent/:id', (req, res) => {
    const id = ObjectId(req.params.id);
    registeredListCollection.deleteOne({ id: id.toString() }).then((result) => {
      res.send(result.deletedCount > 0);
    });
  });
  console.log('connected');
});

app.get('/', (req, res) => {
  res.send('Hello from the other side');
});

app.listen(port, () => {
  console.log('listening....');
});

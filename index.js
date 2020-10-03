const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
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
  console.log('connected');
});

app.get('/', (req, res) => {
  res.send('Hello from the other side');
});

app.listen(port, () => {
  console.log('listening....');
});

const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors')
require('dotenv').config();

const app = express()
const port = process.env.PORT || 5055;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ossg7.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('connect error', err)
 
  const eventCollection = client.db("volunteer").collection("events");
  console.log('successfully')


  app.get('/events', (req, res) => {
    eventCollection.find()
    .toArray((err, items) => {
        res.send(items)
    })
})

  app.post('/addEvent', (req, res) => {
    const newEvent =req.body;
    console.log('adding new event', newEvent);
    eventCollection.insertOne(newEvent)
    .then(result => {
      res.send( {count: result.insertedCount} )
    })
   
  })

  app.delete('/deleteEvent/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    console.log('delete this', id);
    eventCollection.findOneAndDelete({_id: id})
    .then(documents => res.send(!!documents.value))
})

  

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
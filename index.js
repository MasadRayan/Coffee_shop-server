const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.port || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.df8vtvh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const coffeeCollection = client.db('coffeeDB').collection('coffees');
    const userCollection = client.db('coffeeDB').collection('users');

    // Coffee Details add in the backend

    app.get('/coffees', async (req, res) => {
      const result = await coffeeCollection.find().toArray();
      res.send(result);
    })

    app.get('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    })

    app.post('/coffees', async (req, res) => {
      const newCoffee = req.body;
      // console.log(newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    })

    app.put("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)};
      const options = { upsert: true };
      const newCoffee = req.body;
      const updateCoffee = {
        $set: newCoffee
      }
      const result = await coffeeCollection.updateOne(filter, updateCoffee, options);
      res.send(result);
    } )

    app.delete('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    })
    
    // User information added in the backend

    app.get('/users', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    })

    app.post('/users', async (req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    })

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })

    app.patch('/users', async (req, res) => {
      const {email, lastSignInTime} = req.body;
      const filter = {email: email};
      const updatedDoc = {
        $set: {
          lastSignInTime : lastSignInTime
        }
      };
      const result = await userCollection.updateOne(filter, updatedDoc);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send("This is a codde shop data");
})

app.listen(port, () => {
  console.log(`The project is running on ${port}`);
})

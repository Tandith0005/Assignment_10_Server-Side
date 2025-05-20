require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ekx13wz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const userCollection = client.db('gameReview').collection('users');
const reviewCollection = client.db('gameReview').collection("reviews")

// Insert User Data in Database
app.post('/users', async (req, res) => {
    const user = req.body;
    const result = await userCollection.insertOne(user);
    res.send(result);
});

// Get All Users from Database
app.get('/users', async(req,res)=>{
    const cursor = userCollection.find();
    const result = await cursor.toArray();
    res.send(result);
})

// Insert reviews(addReview) Data in Database
app.post('/reviews', async(req,res)=>{
  const review = req.body;
  const result = await reviewCollection.insertOne(review);
  res.send(result)
})

// Get All Users from Database


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Game Review Server!')
})

app.listen(port, () => {
    console.log(`Game Review Server is running on port ${port}`)
});



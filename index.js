require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
const watchListCollection = client.db('gameReview').collection("watchList")

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

// Get All Reviews from Database
app.get('/reviews', async(req,res)=>{
  const cursor = reviewCollection.find();
  const result = await cursor.toArray();
  res.send(result)
})

// Get single Review from Database
app.get('/reviews/:id', async(req,res)=>{
  const id = req.params.id;
  const query = {_id : new ObjectId(id)}
  const result = await reviewCollection.findOne(query);
  res.send(result)
})

// post watchListCollection to database
app.post('/watchListCollection', async(req,res)=>{
  const review = req.body;
  const result = await watchListCollection.insertOne(review);
  res.send(result)
})

// Get reviews by email (for MyReview)
app.get('/reviews/by-email/:email', async(req,res)=>{
  const email = req.params.email;
  const query = {email: email}; 
  const result = await reviewCollection.find(query).toArray();
  res.send(result);
})

// Update/Edit review
app.get('/updateReview/:id', async(req,res)=>{
  const id = req.params.id;
  const query = {_id : new ObjectId(id)}
  const result = await reviewCollection.findOne(query);
  res.send(result)
})

app.put('/reviews/:id', async (req, res) => {
  const id = req.params.id;
  const updatedReview = req.body;
  const filter = { _id: new ObjectId(id) };
  const options = { upsert: false };
  const updateDoc = {
    $set: updatedReview
  };
  const result = await reviewCollection.updateOne(filter, updateDoc, options);
  res.send(result);
});

// Delete review from myReview
app.delete('/reviews/:id',async(req,res)=>{
  const id = req.params.id;
  const query = {_id : new ObjectId(id)}
  const result = await reviewCollection.deleteOne(query);
  res.send(result)
})


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



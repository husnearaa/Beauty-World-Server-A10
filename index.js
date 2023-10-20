const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());








const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z68kb3h.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const cardCollection = client.db("productDB").collection("cards");
    const myCartCollection = client.db("productDB").collection("myCard");

    app.post("/brands", async (req, res) => {
      const brand = req.body;
      const result = await cardCollection.insertOne(brand);
      res.send(result);
    });



    app.get("/brands", async (req, res) => {
      const cursor = cardCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });



    app.get("/brands/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cardCollection.findOne(query);
      res.send(result);
    });


    app.post("/addToCart", async (req, res) => {
      const addToCart = req.body;
      const result = await myCartCollection.insertOne(addToCart);
      res.send(result);
    })


    app.get("/addToCart", async (req, res) => {
      const cursor = myCartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });


    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id
      console.log(id);
      const query = { _id: id }
      const result = await myCartCollection.deleteOne(query)
      res.send(result)
      console.log(result)
    })


    app.put("/addToCart/:id", async (req, res) => {
      const id = req.params.id;
      const newCard = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCard = {
        $set: {
          name: newCard.name,
          brand: newCard.brand,
          type: newCard.type,
          rating: newCard.rating,
          price: newCard.price,
          image: newCard.image,
          description: newCard.description,
        },
      };
      const result = await cardCollection.updateOne(
        filter,
        updateCard,
        options
      );
     
      res.send(result);
      console.log(result);
    });


    app.get("/addToCart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cardCollection.findOne(query);
      res.send(result);
    });





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('beauty world server is running')
})


app.listen(port, () => {
  console.log(`beauty world server is running on port: ${port}`)
})

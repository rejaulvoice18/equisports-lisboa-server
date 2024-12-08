require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
// const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.omdcb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    //Sports equipment database creation
    const sportsCollection = client.db('equipmentDB').collection('equipment')

    // data getting api
    app.get('/sports', async (req, res) => {
      const cursor = sportsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // getting single data api
    app.get('/sports/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await sportsCollection.findOne(query);
      res.send(result);
    })

    // data creating api
    app.post('/sports', async (req, res) => {
      const newEquip = req.body;
      const result = await sportsCollection.insertOne(newEquip);
      res.send(result);
    })

    // updating equipments data
    app.put('/sports/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updatedEquip = req.body;

      const equip = {
        $set: {
          itemName: updatedEquip.itemName,
          category: updatedEquip.category,
          description: updatedEquip.description,
          price: updatedEquip.price,
          rating: updatedEquip.rating,
          customization: updatedEquip.customization,
          processTime: updatedEquip.processTime,
          stock: updatedEquip.stock,
          userEmail: updatedEquip.userEmail,
          userName: updatedEquip.userName,
          equipmentPhoto: updatedEquip.equipmentPhoto,
        }
      }
      const result = await sportsCollection.updateOne(filter, equip, options)
      res.send(result);
    })

     // Delete route
     app.delete('/sports/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      result = await sportsCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('equisports-lisboa-server is running');
})

app.listen(port, () => {
})
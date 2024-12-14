const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require('dotenv').config()

const port = process.env.PORT || 9000
const app = express()

// conceptPrac

// JNVGyTVoM0sXGoTc

app.use(cors())
app.use(express.json())

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@main.yolij.mongodb.net/?retryWrites=true&w=majority&appName=Main`
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bnqcs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function run() {
  try {


    const database = client.db("jobDb");
    const jobCollection = database.collection("jobCollection");



    app.get("/add-jobs/:id",async(req,res)=>{

      let idx=req.params.id

      let query={_id:new ObjectId(idx)}

      const result = await jobCollection.findOne(query);
      res.send(result)
    })




    app.get("/add-jobs",async(req,res)=>{

      const cursor = jobCollection.find();
      let result=await cursor.toArray()
      res.send(result)
    })

    app.post("/add-jobs",async(req,res)=>{

      let formData=req.body

      console.log(formData)

      const result = await jobCollection.insertOne(formData);
      res.send(result)
    })



    app.get("/my-posted-job/:email",async(req,res)=>{

      let email=req.params.email

      let query={email}

      const cursor = jobCollection.find(query);
      let result=await cursor.toArray()
      res.send(result)

    })


    app.delete("/my-posted-job/:id",async(req,res)=>{
      let idx=req.params.id
      let query={_id : new ObjectId(idx)}

      const result = await jobCollection.deleteOne(query);
      res.send(result)
      
    })


    app.put("/my-posted-job/:id",async(req,res)=>{
      let idx=req.params.id

      let data=req.body
      console.log(data.jobTitle)

      let filter={_id:new ObjectId(idx)}

    const updateDoc = {
      $set: {
        
         email:data.email,
        jobTitle:data.jobTitle,
        deadline:data.deadline,
        minPrice:data.minPrice,
        maxPrice:data.maxPrice,
        description:data.description




      },
    };

    const result = await jobCollection.updateOne(filter, updateDoc);
    res.send(result)

    })








    // Send a ping to confirm a successful connection
    // await client.db('admin').command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir)
app.get('/', (req, res) => {
  res.send('Hello from SoloSphere Server....')
})

app.listen(port, () => console.log(`Server running on port ${port}`))

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
    const bitCollection = database.collection("bitCollection");


  //   app.post("/bit-collection", async (req, res) => {

  //     let data = req.body;
  
  //     // Check if a similar submission already exists in bitRequest
  //     let query = { email: data.email, jobId: data.jobId };
  //     const existingRequest = await bitCollection.findOne(query);
  
  //     if (existingRequest) {
  //         // Return the existing request data to the client
  //         return res.status(400).json({ 
  //             message: 'Form already submitted for this job.',
  //             existingRequest: existingRequest // Send the existing request data
  //         });
  //     }
  
  //     // If no existing request, insert the form data into bitCollection
  //     const result = await bitCollection.insertOne(data);
  
  //     // Update bit count
  //     let filter = { _id: new ObjectId(data.jobId) };
  //     const updateDoc = { $inc: { TotalBides: 1 } };
  
  //     await jobCollection.updateOne(filter, updateDoc);
  
  //     // Send the result of the insertion
  //     res.send(result);
  // });
  

  app.get("/getCount",async(req,res)=>{
    let count= await jobCollection.estimatedDocumentCount()

   
    res.send({count})
  })


  app.get("/bit/:email",async(req,res)=>{
    let email=req.params.email
    let buyerM=req.query.buyerM
   let query={}
    if(buyerM){
      query={buyerMail:email}
    }
    else{
      query={email}
    }

  //  let query={}
  //   if(buyerM){
  //     query.buyerMail=email
  //   }
  //   else{
  //     query.email=email
  //   }



  //   }
  // let query = buyerM ? { buyerMail: email } : { email };
    

    // let query={email}

    const cursor = bitCollection.find(query);
    let result= await cursor.toArray()
    res.send(result)
  })


  // app.get("/bit-request/:email",async(req,res)=>{
  //   let email=req.params.email

  //   let query={buyerMail:email}

  //   const cursor = bitCollection.find(query);
  //   let result= await cursor.toArray()
  //   res.send(result)

  // })





  app.put("/updatedStatusBit/:id",async(req,res)=>{

    const id = req.params.id;
  const { status } = req.body;

  const filter = { _id: new ObjectId(id) };
  const updateDoc = {
    $set: { status },
  };

  const result = await bitCollection.updateOne(filter, updateDoc);

  res.send(result);
  })
  app.post("/bit-collection", async (req, res) => {

    let data = req.body;

    // Check if a similar submission already exists in bitRequest
    let query = { email: data.email, jobId: data.jobId };
    const existingRequest = await bitCollection.findOne(query);

    if (existingRequest) {
        // If an existing request is found, send it to the client
        return res.send(existingRequest);
       
    }

    // If no existing request, insert the form data into bitCollection
    const result = await bitCollection.insertOne(data);

    // Update bit count
    let filter = { _id: new ObjectId(data.jobId) };
    const updateDoc = { $inc: { TotalBides: 1 } };

    await jobCollection.updateOne(filter, updateDoc);

    // Send the result of the insertion
    res.send(result); // Send the result of the insertion
});

    app.get("/add-jobs/:id",async(req,res)=>{

      let idx=req.params.id

      let query={_id:new ObjectId(idx)}

      const result = await jobCollection.findOne(query);
      res.send(result)
    })

    app.get("/homeJob",async(req,res)=>{
        
      let cursor=jobCollection.find()
      let result=await cursor.toArray()
      res.send(result)
    })




    app.get("/add-jobs", async (req, res) => {
      console.log(req.query);
    
      let page = parseInt(req.query.page) || 0; // Default to page 0
      let size = parseInt(req.query.size) || 10; // Default to size 10
    
      const cursor = jobCollection
        .find() // Start with find
        .skip(page * size) // Skip based on page
        .limit(size); // Limit the number of documents
    
      const result = await cursor.toArray(); // Convert cursor to array
      res.send(result); // Send the result
    });
    
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

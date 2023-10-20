const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

// sanjidamitu456
// MXH0mZI2H8KpLsGK



const uri = "mongodb+srv://sanjidamitu456:MXH0mZI2H8KpLsGK@cluster0.txhrlfv.mongodb.net/?retryWrites=true&w=majority";

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

    const productCollection = client.db('productDB').collection('product');
    const brandlist = client.db('productDB').collection('brandlist');

    app.get('/brands', async(req,res)=>{
      const cursor = brandlist.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/products', async(req,res)=>{
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

// update
    app.get('/products/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await productCollection.findOne(query);
      res.send(result);
    })


    app.put('/products/:id', async(req,res)=>{
       
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert:true};
      const updatedproduct = req.body;
      const product = {
        $set:{
           name : updatedproduct.name,
           img : updatedproduct.img,
           brandname : updatedproduct.brandname,
         type : updatedproduct.type,
         price : updatedproduct.price,
         shortdes : updatedproduct.shortdes,
         rating :updatedproduct.rating,
        }
      }
     const result = await productCollection.updateOne(filter,product,options);
     res.send(result);

    })

    app.post('/products', async(req,res)=>{
      const newproduct = req.body;
      console.log(newproduct) ;
      const result = await productCollection.insertOne(newproduct);
      res.send(result);
    })

    app.post('/brands', async(req,res)=>{
      const newbrand  = req.body;
      console.log(newbrand ) ;
      const result = await brandlist.insertOne(newbrand );
      res.send(result);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('evergreen is runing')
})


app.listen(port,()=>{
    console.log(`server runing port : ${port}`)
})

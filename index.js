const express = require('express')
require('dotenv').config()
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000


// app.use(
//     cors({
//         origin: ['https://assignment-eleven-b0b1b.web.app'],
//         credentials: true,
//     }),
// )
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.csnq8lx.mongodb.net/?retryWrites=true&w=majority`;

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
    const tasksCollection = client.db('tasksList').collection('tasks');


    app.post('/set/tasks', async (req, res) => {
        const newTask = req.body;
        const result = await tasksCollection.insertOne(newTask);
        res.send(result);
    })

    app.get('/get/tasks', async (req, res) => {
        const email = req.query.email;
        const query = {email: email};
        const result = await tasksCollection.find(query).sort({ sorting: 1 }).toArray();
        res.send(result);
    })



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('scic server is running')
})
app.listen(port, () => {
    console.log(`SCIC job task server is running ${port} `);
})
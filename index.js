const express = require('express')
require('dotenv').config()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
            const nweData = req.body;
            const result = await tasksCollection.insertOne(nweData);
            res.send(result);
        })

        app.get('/get/tasks', async (req, res) => {
            const email = req.query.email;
            const filter = { email: email };
            const result = await tasksCollection.find(filter).sort({ sorting: 1 }).toArray();
            res.send(result);
        })


        app.put('/update/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateTask = req.body;
            const task = {
                $set: {
                    title: updateTask.title,
                    description: updateTask.description,
                    deadline: updateTask.deadline,
                    priority: updateTask.priority,
                    sorting: updateTask.sorting
                }
            };
            const result = await tasksCollection.updateOne(filter, task, options);
            res.send(result);
        })

        app.patch('/tasks/innerUpdate/:id', async (req, res) => {
            const id = req.params.id;
            const update = req.body;
            console.log(update);
            const filter = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: {
                    status: update
                }
            };
           
            const result = await tasksCollection.updateOne(filter, updatedDoc);
            res.send(result);
        })


        app.delete('/delete/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await tasksCollection.deleteOne(query);
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
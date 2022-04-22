const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;


//use middleware
app.use(cors());
app.use(express.json()); // for reading the body

//user: dbuser1
//password: unHs52iwuEarGUS4



const uri = "mongodb+srv://dbuser1:unHs52iwuEarGUS4@cluster0.unoqt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
    const userCollection = client.db('foodExpress').collection('user');
    //send data to client 
    app.get('/user', async(req,res) => {
        const query = {};
        const cursor = userCollection.find(query);
        const users = await cursor.toArray();
        res.send(users);
    })
    //get data from client and fire to database
    app.post('/user', async(req,res) => {
        const newUser = req.body;
        console.log('New user is:', newUser);
        const result = await userCollection.insertOne(newUser);
        res.send(result);
    })

    //find a data 
    app.get('/user/:id', async(req,res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await userCollection.findOne(query);
        res.send(result);
    })

    //update a user
    app.put('/user/:id', async(req, res) => {
        const id = req.params.id;
        const updateUser = req.body;
        const query = {_id: ObjectId(id)};
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                name: updateUser.name,
                email: updateUser.email
            }
        }
        const result = await userCollection.updateOne(query, updateDoc, options);
        res.send(result);
    })

    //delete user 
    app.delete('/user/:id', async(req,res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await userCollection.deleteOne(query);
        res.send(result);
    })
    }
    finally{
        // await client.close();
    }
    
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Got that');
})


app.listen(port, () => {
    console.log('Crud is running');
})
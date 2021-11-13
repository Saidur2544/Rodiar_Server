const express = require("express");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
//heroku git:remote -a ancient-plains-04086
//Midlewere
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kynb9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const productCollection = client.db("rodiar").collection("products");
    const usersCollection = client.db("rodiar").collection("users");
    const ordersCollection = client.db("rodiar").collection("orders");
    const reviewsCollection = client.db("rodiar").collection("reviews");

    console.log("database connect")

    // Insert product Data
    app.post("/addProducts", async (req, res) => {
        try{
            const result = await productCollection.insertOne(req.body);
            res.send(result);
        }
        catch{

        }
        
    });
    // Insert order Data
    app.post("/addOrder", async (req, res) => {
        try{
            const result = await ordersCollection.insertOne(req.body);
            res.send(result);
        }
        catch{

        }
        
    });
    // Insert user Data
    app.post("/users", async (req, res) => {
        try{
            const result = await usersCollection.insertOne(req.body);
            res.send(result);
        }
        catch{

        }
        
    });
    // Insert user Data
    app.post("/review", async (req, res) => {
        try{
            const result = await reviewsCollection.insertOne(req.body);
            res.send(result);
        }
        catch{

        }
        
    });

    // Update  admin user Data
    app.put('/admin',  async (req, res) => {
        const user = req.body;
        try{
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        }
        catch {
            
        }

    })
    // Update  order for shipped
    app.put('/shippedOrder/:id',  async (req, res) => {
        const id = { _id: ObjectId(req.params.id) }
        try{
            const updateDoc = { $set: { status: 'shipped' } };
            const result = await ordersCollection.updateOne(id, updateDoc);
            res.json(result);
        }
        catch {
            
        }

    })

    // get home product
    app.get("/homeProducts", async (req, res) => {
        try{
            const result = await productCollection.find({}).limit(6).toArray();
            res.send(result);
        }
        catch{

        }
    });
    // get all products 
    app.get("/allProducts", async (req, res) => {
        try{
            const result = await productCollection.find({}).toArray();
            res.send(result);
        }
        catch{

        }
    });
    // get all orders 
    app.get("/allOrders", async (req, res) => {
        try{
            const result = await ordersCollection.find({}).toArray();
            res.send(result);
        }
        catch{

        }
    });
    // get all orders 
    app.get("/myOrders/:email", async (req, res) => {
        try{
            const query = { userEmail: (req.params.email) }
            const result = await ordersCollection.find(query).toArray();
            res.send(result);
        }
        catch{

        }
    });
    // get all Reviews 
    app.get("/allReviews", async (req, res) => {
        try{
            const result = await reviewsCollection.find({}).toArray();
            res.send(result);
        }
        catch{

        }
    });

    // get Single products
    app.get("/Product/:id", async (req, res) => {
        try{
            const query = { _id: ObjectId(req.params.id) };
            const result = await productCollection.find(query).toArray();
            res.send(result[0]);
        }
        catch{
            
        }
    });

    // get admin 
    app.get('/users/:email', async (req, res) => {
        const email = req.params.email;
        try{
            const query = { email: email };
            const result = await usersCollection.findOne(query);
            let isAdmin = false;
            if (result?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        }
        catch{
            
        }
    });
    // delete products
    app.delete("/deleteProduct/:id", async (req, res) => {
        try{
            const id = { _id: ObjectId(req.params.id) }
            const result = await productCollection.deleteOne(id);
            res.send(result);
        }
        catch{

        }
    });
    // delete order
    app.delete("/deleteOrder/:id", async (req, res) => {
        try{
            const id = { _id: ObjectId(req.params.id) }
            const result = await ordersCollection.deleteOne(id);
            res.send(result);
        }
        catch{

        }
    });

    // client.close();
});

app.get("/", (req, res) => {
    res.send("Wellcome to Running Server ");
});
app.listen(port, () => {
    console.log('Running Rodiar Server on port', port);
})
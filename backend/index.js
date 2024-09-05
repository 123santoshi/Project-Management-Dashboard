import express from "express";
import cors from 'cors';
import mongoose from "mongoose";
import Project from './Collectiondata.js';
import Users from "./Users.js";


const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.listen(port, () => console.log(`Server running on port ${port}`));

const connectionString = "mongodb://localhost:27017/Projects"; 

mongoose.connect(connectionString, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(() => console.log("Server connected to MongoDB"))
.catch((error) => console.log("Error while connecting to MongoDB: ", error));


app.get("/" , async (req,res)=>{
    res.json("dafult methido is calling");
})

app.use("/tasks",Project);

app.get("/tasks/taskstatus",Project);
app.get("/tasks/:id",Project);
app.post("/tasks",Project);
app.put("/tasks/:id",Project);
app.delete("/tasks/:id",Project);
app.post("/tasks/:taskId/logtime",Project);

app.use("/users",Users);
app.get("/users/inactive",Users);
app.post("/users",Users);
app.put("/users/:id",Users);
app.delete("/users/:id",Users);



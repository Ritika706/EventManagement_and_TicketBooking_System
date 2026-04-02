import express from 'express'; //server bnane k liye
import dotenv from 'dotenv';
import eventRoutes from './routes/eventRoutes.js'//eventroutes se routes le rha

dotenv.config();//env file se uri lene k liye

import connectDB from './config/db.js';//db.js m se connectdb function call krega jisme mongodb se connect krega

connectDB();

const app=express();//express ka object create kr liya
app.use(express.json());//json data ko read krne k liye


app.use("/api",eventRoutes);//api se start hone wale routes ko use krna

app.listen(5000,()=>{
    console.log("Server running on port 5000");
});
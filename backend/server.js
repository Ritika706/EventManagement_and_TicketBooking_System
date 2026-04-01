const express=require('express');//server bnane k liye
const dotenv=require('dotenv');

dotenv.config();//env file se uri lene k liye

const connectDB=require('./config/db');//db.js m se connectdb function call krega jisme mongodb se connect krega

connectDB();

const app=express();//express ka object create kr liya
app.use(express.json());//json data ko read krne k liye

const eventRoutes=require('./routes/eventRoutes');//eventroutes se routes le rha
app.use("/api",eventRoutes);//api se start hone wale routes ko use krna

app.listen(5000,()=>{
    console.log("Server running on port 5000");
});
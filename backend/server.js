import express from 'express'; //server bnane k liye
import dotenv from 'dotenv';
import eventRoutes from './Route/eventRoutes.js'//eventroutes se routes le rha
import bookingRoute from './Route/bookingRoutes.js'; //booking routes
import userRoutes from './Route/userRoutes.js'; //user routes
import {connectDB} from './config/db.js';//db.js m se connectdb function call krega jisme mongodb se connect krega
import cors from "cors";

dotenv.config();//env file se uri lene k liye



connectDB();


const app=express();//express ka object create kr liya
app.use(cors());
app.use(express.json());//json data ko read krne k liye


//api se start honge sare routes

// this is for event
app.use("/api/event",eventRoutes);

// thie route is for Bookings
app.use("/api/booking",bookingRoute);

// route for the users
app.use("/api/user",userRoutes);

app.get('/',(req,res)=>{
    res.send("Welcome")
})

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server running on port : ${PORT}`);
});
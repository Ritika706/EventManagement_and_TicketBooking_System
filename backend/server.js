import express from 'express'; //server bnane k liye
import dotenv from 'dotenv';
import eventRoutes from './Route/eventRoutes.js'//eventroutes se routes le rha
import bookingRoute from './Route/bookingRoutes.js'; //booking routes
import {connectDB} from './config/db.js';//db.js m se connectdb function call krega jisme mongodb se connect krega

dotenv.config();//env file se uri lene k liye



connectDB();


const app=express();//express ka object create kr liya

app.use(express.json());//json data ko read krne k liye


//api se start honge sare routes

// this is for event
app.use("/api/event",eventRoutes);

// thie route is for Bookings
app.use("/api/booking",bookingRoute);



app.listen(process.env.PORT,()=>{
    console.log(`Server running on port : ${process.env.PORT}`);
});
import express from 'express'; //server bnane k liye
import dotenv from 'dotenv';
import eventRoutes from './Route/eventRoutes.js'//eventroutes se routes le rha
import bookingRoute from './Route/bookingRoutes.js'; //booking routes
import authRoutes from './Route/authRoutes.js'; //auth routes
import {connectDB} from './config/db.js';//db.js m se connectdb function call krega jisme mongodb se connect krega
import cors from "cors";
import { notFound, errorHandler } from "./middleware/errorHandlers.js";

dotenv.config();//env file se uri lene k liye



connectDB();


const app=express();//express ka object create kr liya
app.use(cors({
    origin: process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());//json data ko read krne k liye


//api se start honge sare routes

// this is for event
// Frontend calls /api/events and /api/create-event
app.use("/api", eventRoutes);

// thie route is for Bookings
// Frontend calls /api/book-ticket and /api/bookings
app.use("/api", bookingRoute);

// auth (signup/login)
app.use("/api/auth", authRoutes);

app.get('/',(req,res)=>{
    res.send("Welcome")
})

// Global error handling
app.use(notFound);
app.use(errorHandler);

app.listen(5000,()=>{
    console.log(`Server running on port : 5000`);
});
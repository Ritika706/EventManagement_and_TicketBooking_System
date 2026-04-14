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
const PORT = Number(process.env.PORT) || 5000;
const envOrigins = (process.env.CORS_ORIGIN || process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
const allowedOrigins = envOrigins.length
    ? envOrigins
    : ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"];


const app=express();//express ka object create kr liya
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
}));
app.use(express.json());//json data ko read krne k liye

app.get('/api', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Eventra API is running'
    });
});


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

app.listen(PORT,()=>{
    console.log(`Server running on port : ${PORT}`);
});
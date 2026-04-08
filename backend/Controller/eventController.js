import mongoose from 'mongoose';    
import eventModel from '../Model/eventSchema.js';

// create a new event

export const createEvent=async(req,res)=>{
    try{const {title,date,venue,price,total_tickets,available_tickets}=req.body;
    const createEve = await eventModel.create({
        title,
        date,
        venue,
        price,
        total_tickets,
        available_tickets
    });

    res.status(201).json({
        message:"Event Created",
        createEve});}catch(error){
            res.status(404).json({error:error.message})
        }

}
import express from 'express';
import eventModel from '../Model/eventSchema.js';
import { createEvent } from '../Controller/eventController.js';


const router=express.Router();//router bnana(route system of express imported)
// const Event = require("../models/Event");//importing the event model

router.post("/create-event",createEvent);

router.get("/events", async (req, res) => {//route for getting all events
const events = await eventModel.find();//finding all events from the database
res.json(events);
});

export default router;

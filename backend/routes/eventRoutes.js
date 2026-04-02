import express from 'exress';
import eventModel from './Model/eventSchema.js';



const router=express.Router();//router bnana(route system of express imported)
// const Event = require("../models/Event");//importing the event model

router.post("/create-event", async (req, res) => {//route for creating an event
const event = new eventModel(req.body);//creating a new event using the data from the request body
await event.save();//saving the event to the database
res.json(event);//data wapas bhejta hai json m 
});

router.get("/events", async (req, res) => {//route for getting all events
const events = await eventModel.find();//finding all events from the database
res.json(events);
});

export default router;

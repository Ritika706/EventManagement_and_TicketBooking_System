import express from 'express';
import { createEvent, deleteEvent, getAllEvents, getEventById, updateEvent } from '../Controller/eventController.js';
import { authMiddleware, isAdmin } from "../middleware/authMiddleware.js";
import { validateBody, validateParams, validateQuery } from "../middleware/validate.js";
import { eventCreateSchema, eventUpdateSchema, eventsQuerySchema, bookingIdParamsSchema } from "../validation/schemas.js";


const router=express.Router();//router bnana(route system of express imported)
// const Event = require("../models/Event");//importing the event model

router.post("/create-event", authMiddleware, isAdmin, validateBody(eventCreateSchema), createEvent);

// Frontend expects these paths
router.get("/events", validateQuery(eventsQuerySchema), getAllEvents);
router.get("/events/:id", validateParams(bookingIdParamsSchema), getEventById);
router.put("/events/:id", authMiddleware, isAdmin, validateParams(bookingIdParamsSchema), validateBody(eventUpdateSchema), updateEvent);
router.delete("/events/:id", authMiddleware, isAdmin, validateParams(bookingIdParamsSchema), deleteEvent);

export default router;

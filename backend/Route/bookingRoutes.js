import express from "express";

import {
	bookTicket,
	getAllBookings,
	getBookingsByUser,
	cancelBooking,
} from "../Controller/bookingController.js";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware.js";
import { validateBody, validateParams } from "../middleware/validate.js";
import { bookingCreateSchema, bookingIdParamsSchema, userIdParamsSchema } from "../validation/schemas.js";

const router = express.Router();

// Frontend-compatible
router.post("/book-ticket", authMiddleware, validateBody(bookingCreateSchema), bookTicket);

// Admin: view all bookings
router.get("/bookings", authMiddleware, isAdmin, getAllBookings);

// User: view own bookings
router.get("/bookings/:userId", authMiddleware, validateParams(userIdParamsSchema), getBookingsByUser);
router.delete("/bookings/:id", authMiddleware, validateParams(bookingIdParamsSchema), cancelBooking);

export default router;
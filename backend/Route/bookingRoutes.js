import express from 'express';

import {bookTicket, getAllBooking, getBookingById} from '../Controller/bookingController.js';

const router=express.Router();

// to book the tickets
router.post('/book-ticket',bookTicket);


// FOR ADMIN


// to get all the users
router.get('/get-all-bookings',getAllBooking);

// to get the booking by id
router.get('/get-booking-byId/:id',getBookingById);



export default router;
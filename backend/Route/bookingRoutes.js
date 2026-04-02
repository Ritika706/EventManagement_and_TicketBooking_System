import express from 'express';

import {bookTicket} from '../Controller/bookingController.js';

const router=express.Router();

router.post('/book-ticket',bookTicket);

export default router;
import express from 'express';
import { createPayment, updatePaymentStatus, getPaymentById, getPaymentsByBooking } from '../Controller/paymentController.js';

const router = express.Router();

// Create a new payment
router.post('/create-payment', createPayment);

// Update payment status
router.put('/update-payment-status', updatePaymentStatus);

// Get payment by ID
router.get('/get-payment/:paymentId', getPaymentById);

// Get payments by booking ID
router.get('/get-payments-by-booking/:bookingId', getPaymentsByBooking);

export default router;
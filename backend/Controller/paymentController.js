
import paymentModel from '../Model/paymentSchema.js';
import bookingModel from '../Model/bookingSchema.js';

export const createPayment = async (req, res) => {
    try {
        const { bookingId, amount, paymentMethod } = req.body;

        // Input validation
        if (!bookingId || !amount || !paymentMethod) {
            return res.status(400).json({ message: "bookingId, amount, and paymentMethod are required" });
        }

        // Check if booking exists
        const booking = await bookingModel.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Create payment record
        const newPayment = await paymentModel.create({
            bookingId,
            amount,
            paymentMethod,
            status: 'pending'
        });

        res.status(201).json({ message: "Payment initiated", payment: newPayment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePaymentStatus = async (req, res) => {
    try {
        const { paymentId, status, transactionId } = req.body;

        // Input validation
        if (!paymentId || !status) {
            return res.status(400).json({ message: "paymentId and status are required" });
        }

        // Update payment status
        const updatedPayment = await paymentModel.findByIdAndUpdate(
            paymentId,
            { status, transactionId, updatedAt: Date.now() },
            { new: true }
        );

        if (!updatedPayment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        res.status(200).json({ message: "Payment status updated", payment: updatedPayment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPaymentById = async (req, res) => {
    try {
        const { paymentId } = req.params;

        const payment = await paymentModel.findById(paymentId).populate('bookingId');
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        res.status(200).json({ payment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPaymentsByBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const payments = await paymentModel.find({ bookingId });
        res.status(200).json({ payments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
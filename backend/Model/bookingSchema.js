import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        // Legacy field name kept: eventId
        eventId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Event" },

        // Frontend expects a user object on booking; store userId and populate.
        userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },

        // Optional legacy / display name
        userName: { type: String, trim: true, maxLength: [25, "maximum length reached for naming convention"] },

        quantity: { type: Number, required: true, min: 1 },
        totalAmount: { type: Number, required: true, min: 0, default: 0 },

        status: {
            type: String,
            enum: ["confirmed", "pending", "cancelled"],
            default: "confirmed",
        },

        // For industry-style flow: pending booking holds inventory until this time.
        lockExpiresAt: { type: Date, default: null, index: true },
    },
    { timestamps: true }
);

const bookingModel = mongoose.model("Booking", bookingSchema);

export default bookingModel;
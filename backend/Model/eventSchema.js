import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, default: "", trim: true },
        date: { type: Date, required: true },
        location: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0, default: 0 },
        totalTickets: { type: Number, required: true, min: 1 },
        availableTickets: { type: Number, required: true, min: 0 },
        category: { type: String, default: "Other", trim: true },
        imageUrl: { type: String, default: null, trim: true },

        // Backward-compatible fields (older backend versions)
        venue: { type: String, select: false },
        total_tickets: { type: Number, select: false },
        available_tickets: { type: Number, select: false },
    },
    { timestamps: true }
);

const eventModel = mongoose.model("Event", eventSchema);

export default eventModel;


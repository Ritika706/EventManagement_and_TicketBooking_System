import bookingModel from "../Model/bookingSchema.js";
import eventModel from "../Model/eventSchema.js";
import User from "../Model/userSchema.js";

const toNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : NaN;
};

const serializeBooking = (doc) => {
    const obj = typeof doc.toObject === "function" ? doc.toObject() : doc;
    const event = obj.event || obj.eventId;
    const user = obj.user || obj.userId;
    return {
        ...obj,
        event,
        user,
        id: obj._id,
    };
};

export const bookTicket = async (req, res) => {
    try {
        const { eventId, userId, quantity } = req.body || {};

        // AuthZ: user can only create bookings for themselves (admin allowed)
        const authUserId = req.user?.id;
        const authRole = req.user?.role;
        if (!authUserId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        if (authRole !== "admin" && String(userId) !== String(authUserId)) {
            return res.status(403).json({ success: false, message: "You can only book for your own account" });
        }

        const qty = toNumber(quantity);
        if (!eventId || !userId || !Number.isFinite(qty) || qty < 1) {
            return res.status(400).json({ success: false, message: "eventId, userId and valid quantity are required" });
        }

        const [event, user] = await Promise.all([
            eventModel.findById(eventId).select("+available_tickets +total_tickets +venue"),
            User.findById(userId),
        ]);

        if (!event) return res.status(404).json({ success: false, message: "Event does not exist" });
        if (!user) return res.status(404).json({ success: false, message: "User does not exist" });

        const available =
            event.availableTickets ??
            event.available_tickets ??
            0;

        if (available < qty) {
            return res.status(400).json({ success: false, message: "tickets are not available, try reducing the number of tickets" });
        }

        const price = Number(event.price || 0);
        const totalAmount = qty * price;

        const remaining = available - qty;
        // Update ticket count without running full document validation.
        // This avoids failures for legacy Event docs that may not have required
        // new fields like location/totalTickets in the DB yet.
        await eventModel.updateOne(
            { _id: event._id },
            {
                $set: {
                    availableTickets: remaining,
                    // keep legacy field in sync if it exists in older data
                    available_tickets: remaining,
                },
            }
        );

        const booking = await bookingModel.create({
            eventId: event._id,
            userId: user._id,
            userName: user.name,
            quantity: qty,
            totalAmount,
            status: "confirmed",
        });

        const populated = await bookingModel
            .findById(booking._id)
            .populate("eventId")
            .populate("userId", "name email role");

        const out = serializeBooking({
            ...populated.toObject(),
            event: populated.eventId,
            user: populated.userId,
        });

        delete out.eventId;
        delete out.userId;

        return res.status(201).json({ success: true, message: "Booking Completed", booking: out, data: out });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server error" });
    }
};
// NOW THESE NEXT FUNCTIONS ARE FOR THE ADMIN PURPOSES


// get all the bookings 

export const getAllBookings = async (req, res) => {
    try {
        // Route already has isAdmin, this is a safety check
        if (req.user?.role !== "admin") {
            return res.status(403).json({ success: false, message: "Admin access required" });
        }
        const bookings = await bookingModel
            .find()
            .sort({ createdAt: -1 })
            .populate("eventId")
            .populate("userId", "name email role");

        const out = bookings.map((b) => {
            const o = b.toObject();
            o.event = o.eventId;
            o.user = o.userId;
            delete o.eventId;
            delete o.userId;
            return o;
        });

        return res.status(200).json({ success: true, bookings: out, data: out });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server error" });
    }
};



// get all the bookings by id

export const getBookingsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const authUserId = req.user?.id;
        const authRole = req.user?.role;
        if (!authUserId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        if (authRole !== "admin" && String(userId) !== String(authUserId)) {
            return res.status(403).json({ success: false, message: "You can only view your own bookings" });
        }

        const bookings = await bookingModel
            .find({ userId })
            .sort({ createdAt: -1 })
            .populate("eventId")
            .populate("userId", "name email role");

        const out = bookings.map((b) => {
            const o = b.toObject();
            o.event = o.eventId;
            o.user = o.userId;
            delete o.eventId;
            delete o.userId;
            return o;
        });

        return res.status(200).json({ success: true, bookings: out, data: out });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server error" });
    }
};

export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await bookingModel.findById(id);
        if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

        const authUserId = req.user?.id;
        const authRole = req.user?.role;
        if (!authUserId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        if (authRole !== "admin" && String(booking.userId) !== String(authUserId)) {
            return res.status(403).json({ success: false, message: "You can only cancel your own booking" });
        }

        if (booking.status === "cancelled") {
            return res.status(200).json({ success: true, message: "Booking already cancelled" });
        }

        // Restore ticket availability (best-effort) then mark booking cancelled.
        const qty = Number(booking.quantity || 0);
        if (qty > 0 && booking.eventId) {
            const event = await eventModel
                .findById(booking.eventId)
                .select("+available_tickets +total_tickets +venue");

            if (event) {
                const currentAvailable = event.availableTickets ?? event.available_tickets ?? 0;
                const total = event.totalTickets ?? event.total_tickets;
                const restored = currentAvailable + qty;
                const nextAvailable = typeof total === "number" ? Math.min(restored, total) : restored;

                await eventModel.updateOne(
                    { _id: event._id },
                    {
                        $set: {
                            availableTickets: nextAvailable,
                            available_tickets: nextAvailable,
                        },
                    }
                );
            }
        }

        booking.status = "cancelled";
        booking.lockExpiresAt = null;
        await booking.save();

        return res.status(200).json({ success: true, message: "Booking cancelled" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server error" });
    }
};

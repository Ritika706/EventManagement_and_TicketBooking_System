import eventModel from "../Model/eventSchema.js";

const serializeEvent = (doc) => {
    if (!doc) return doc;
    const obj = typeof doc.toObject === "function" ? doc.toObject() : doc;

    const location = obj.location ?? obj.venue;
    const totalTickets = obj.totalTickets ?? obj.total_tickets;
    const availableTickets = obj.availableTickets ?? obj.available_tickets;

    const cleaned = {
        ...obj,
        location,
        totalTickets,
        availableTickets,
    };

    delete cleaned.venue;
    delete cleaned.total_tickets;
    delete cleaned.available_tickets;

    return cleaned;
};

const toNumberOrUndefined = (value) => {
    if (value === null || value === undefined || value === "") return undefined;
    const n = Number(value);
    return Number.isFinite(n) ? n : undefined;
};

const normalizeEventPayload = (body = {}) => {
    const title = typeof body.title === "string" ? body.title.trim() : body.title;
    const description = typeof body.description === "string" ? body.description.trim() : body.description;

    const location =
        (typeof body.location === "string" && body.location.trim())
            ? body.location.trim()
            : (typeof body.venue === "string" ? body.venue.trim() : body.venue);

    const category = typeof body.category === "string" ? body.category.trim() : body.category;
    const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl.trim() : body.imageUrl;

    const price = toNumberOrUndefined(body.price);

    const totalTickets =
        toNumberOrUndefined(body.totalTickets) ??
        toNumberOrUndefined(body.total_tickets);

    const availableTickets =
        toNumberOrUndefined(body.availableTickets) ??
        toNumberOrUndefined(body.available_tickets) ??
        totalTickets;

    const dateValue = body.date;
    const parsedDate = dateValue ? new Date(dateValue) : null;

    return {
        title,
        description,
        date: parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate : undefined,
        location,
        price,
        totalTickets,
        availableTickets,
        category,
        imageUrl: imageUrl || null,
    };
};

export const createEvent = async (req, res) => {
    try {
        const payload = normalizeEventPayload(req.body);

        if (!payload.title) {
            return res.status(400).json({ message: "title is required" });
        }
        if (!payload.date) {
            return res.status(400).json({ message: "valid date is required" });
        }
        if (!payload.location) {
            return res.status(400).json({ message: "location is required" });
        }
        if (payload.price === undefined) {
            return res.status(400).json({ message: "valid price is required" });
        }
        if (!payload.totalTickets || payload.totalTickets < 1) {
            return res.status(400).json({ message: "totalTickets must be at least 1" });
        }
        if (payload.availableTickets === undefined || payload.availableTickets < 0) {
            return res.status(400).json({ message: "availableTickets must be 0 or more" });
        }
        if (payload.availableTickets > payload.totalTickets) {
            payload.availableTickets = payload.totalTickets;
        }

        const created = await eventModel.create(payload);

        return res.status(201).json({
            success: true,
            message: "Event Created",
            event: created,
            createEve: created,
            data: created,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server error" });
    }
};

export const getAllEvents = async (req, res) => {
    try {
        const page = Math.max(1, Number(req.query.page || 1));
        const limitRaw = Number(req.query.limit || 0);
        const limit = limitRaw ? Math.min(Math.max(1, limitRaw), 50) : 0;
        const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
        const category = typeof req.query.category === "string" ? req.query.category.trim() : "";
        const sortKey = typeof req.query.sort === "string" ? req.query.sort : "date";
        const order = String(req.query.order || "asc").toLowerCase() === "desc" ? -1 : 1;

        const filter = {};
        if (category) filter.category = category;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
            ];
        }

        const sort =
            sortKey === "price"
                ? { price: order, date: 1 }
                : { date: order, createdAt: -1 };

        const query = eventModel
            .find(filter)
            .select("+venue +total_tickets +available_tickets")
            .sort(sort);

        if (limit) {
            query.skip((page - 1) * limit).limit(limit);
        }

        const [events, total] = await Promise.all([
            query,
            eventModel.countDocuments(filter),
        ]);

        const out = events.map(serializeEvent);

        return res.status(200).json({
            success: true,
            events: out,
            data: out,
            page: limit ? page : undefined,
            limit: limit || undefined,
            total,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server error" });
    }
};

export const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await eventModel.findById(id).select("+venue +total_tickets +available_tickets");
        if (!event) return res.status(404).json({ message: "Event not found" });
        const out = serializeEvent(event);
        return res.status(200).json({ success: true, event: out, data: out });
    } catch (error) {
        return res.status(400).json({ success: false, message: "Invalid event id" });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = normalizeEventPayload(req.body);

        // Remove undefined fields so we don't overwrite existing values.
        Object.keys(updates).forEach((k) => updates[k] === undefined && delete updates[k]);

        if (updates.totalTickets !== undefined && updates.totalTickets < 1) {
            return res.status(400).json({ message: "totalTickets must be at least 1" });
        }
        if (updates.availableTickets !== undefined && updates.availableTickets < 0) {
            return res.status(400).json({ message: "availableTickets must be 0 or more" });
        }

        const current = await eventModel.findById(id);
        if (!current) return res.status(404).json({ success: false, message: "Event not found" });

        const nextTotal = updates.totalTickets ?? current.totalTickets;
        const nextAvailable = updates.availableTickets ?? current.availableTickets;
        if (nextAvailable > nextTotal) {
            updates.availableTickets = nextTotal;
        }

        const updated = await eventModel.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });

        const out = serializeEvent(updated);
        return res.status(200).json({ success: true, message: "Event updated", event: out, data: out });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message || "Invalid request" });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await eventModel.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ success: false, message: "Event not found" });
        return res.status(200).json({ success: true, message: "Event deleted" });
    } catch (error) {
        return res.status(400).json({ success: false, message: "Invalid event id" });
    }
};
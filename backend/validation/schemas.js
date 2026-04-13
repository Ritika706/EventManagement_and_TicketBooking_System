import { z } from "zod";

export const objectId = z
  .string()
  .min(1)
  .regex(/^[a-fA-F0-9]{24}$/, "Invalid id");

const email = z.string().trim().toLowerCase().email();

export const authSignupSchema = z
  .object({
    name: z.string().trim().min(1).max(25),
    email,
    password: z.string().min(8),
    role: z.enum(["user", "admin"]).optional(),
  })
  .passthrough();

export const authLoginSchema = z
  .object({
    email,
    password: z.string().min(1),
    role: z.enum(["user", "admin"]).optional(),
  })
  .passthrough();

export const forgotPasswordSchema = z
  .object({
    email,
    role: z.enum(["user", "admin"]).optional(),
  })
  .passthrough();

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    newPassword: z.string().min(8),
    role: z.enum(["user", "admin"]).optional(),
  })
  .passthrough();

const eventBaseSchema = z
  .object({
    title: z.string().trim().min(1),
    description: z.string().optional().default(""),
    date: z.union([z.string().min(1), z.date()]),
    location: z.string().trim().min(1).optional(),
    // legacy
    venue: z.string().trim().min(1).optional(),
    price: z.coerce.number().min(0),
    totalTickets: z.coerce.number().int().min(1).optional(),
    // legacy
    total_tickets: z.coerce.number().int().min(1).optional(),
    availableTickets: z.coerce.number().int().min(0).optional(),
    // legacy
    available_tickets: z.coerce.number().int().min(0).optional(),
    category: z.string().trim().optional(),
    imageUrl: z.string().trim().url().nullable().optional(),
  })
  .passthrough();

export const eventCreateSchema = eventBaseSchema.superRefine((val, ctx) => {
  const hasLocation = Boolean(val.location || val.venue);
  if (!hasLocation) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "location is required",
      path: ["location"],
    });
  }
  const hasTotal =
    typeof val.totalTickets === "number" || typeof val.total_tickets === "number";
  if (!hasTotal) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "totalTickets is required",
      path: ["totalTickets"],
    });
  }
});

export const eventUpdateSchema = z
  .object({
    title: z.string().trim().min(1).optional(),
    description: z.string().optional(),
    date: z.union([z.string().min(1), z.date()]).optional(),
    location: z.string().trim().min(1).optional(),
    // legacy
    venue: z.string().trim().min(1).optional(),
    price: z.coerce.number().min(0).optional(),
    totalTickets: z.coerce.number().int().min(1).optional(),
    // legacy
    total_tickets: z.coerce.number().int().min(1).optional(),
    availableTickets: z.coerce.number().int().min(0).optional(),
    // legacy
    available_tickets: z.coerce.number().int().min(0).optional(),
    category: z.string().trim().optional(),
    imageUrl: z.string().trim().url().nullable().optional(),
  })
  .passthrough();

export const eventsQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(50).optional(),
    search: z.string().trim().optional(),
    category: z.string().trim().optional(),
    sort: z.enum(["date", "price"]).optional(),
    order: z.enum(["asc", "desc"]).optional(),
  })
  .passthrough();

export const bookingCreateSchema = z
  .object({
    eventId: objectId,
    userId: objectId,
    quantity: z.coerce.number().int().min(1),
  })
  .passthrough();

export const bookingIdParamsSchema = z.object({ id: objectId }).passthrough();
export const userIdParamsSchema = z.object({ userId: objectId }).passthrough();

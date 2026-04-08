// ── EventForm Component ───────────────────────────────────────────────────────
// Used for both Create and Edit event flows.

import React, { useState, useEffect } from "react";
import Alert from "./Alert";
import { ButtonLoader } from "./Loader";

const CATEGORIES = ["Music", "Tech", "Food", "Art", "Sports", "Conference", "Other"];

const EMPTY_FORM = {
  title: "",
  description: "",
  date: "",
  time: "",
  location: "",
  price: "",
  totalTickets: "",
  availableTickets: "",
  category: "Music",
  imageUrl: "",
};

/**
 * EventForm
 * @param {object}  initialData   Pre-populate for edit mode
 * @param {func}    onSubmit      (formData) => Promise
 * @param {boolean} isEdit        Show "Update" vs "Create"
 */
const EventForm = ({ initialData, onSubmit, isEdit = false }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      const d = new Date(initialData.date);
      const dateStr = d.toISOString().slice(0, 10);
      const timeStr = d.toTimeString().slice(0, 5);
      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
        date: dateStr,
        time: timeStr,
        location: initialData.location || "",
        price: initialData.price ?? "",
        totalTickets: initialData.totalTickets ?? "",
        availableTickets: initialData.availableTickets ?? "",
        category: initialData.category || "Music",
        imageUrl: initialData.imageUrl || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validate = () => {
    if (!form.title.trim()) return "Event title is required.";
    if (!form.date) return "Event date is required.";
    if (!form.location.trim()) return "Location is required.";
    if (form.price === "" || isNaN(Number(form.price))) return "Valid price is required (use 0 for free).";
    if (!form.totalTickets || isNaN(Number(form.totalTickets))) return "Total tickets count is required.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Combine date + time into ISO string
      const datetime = form.time
        ? new Date(`${form.date}T${form.time}:00`)
        : new Date(form.date);

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        date: datetime.toISOString(),
        location: form.location.trim(),
        price: Number(form.price),
        totalTickets: Number(form.totalTickets),
        availableTickets: form.availableTickets !== ""
          ? Number(form.availableTickets)
          : Number(form.totalTickets),
        category: form.category,
        imageUrl: form.imageUrl.trim() || null,
      };

      await onSubmit(payload);
      setSuccess(isEdit ? "Event updated successfully!" : "Event created successfully!");
      if (!isEdit) setForm(EMPTY_FORM);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, name, type = "text", placeholder, required, ...rest }) => (
    <div>
      <label className="input-label">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className="input-field"
        required={required}
        {...rest}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} autoClose={4000} />}

      {/* Row 1: Title + Category */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <InputField label="Event Title" name="title" placeholder="e.g. Summer Music Festival 2025" required />
        </div>
        <div>
          <label className="input-label">Category <span className="text-red-400">*</span></label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="input-field"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-ink-800">{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="input-label">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the event, performers, schedule…"
          rows={4}
          className="input-field resize-none"
        />
      </div>

      {/* Row 2: Date + Time + Location */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Date" name="date" type="date" required />
        <InputField label="Time" name="time" type="time" />
        <InputField label="Location / Venue" name="location" placeholder="City, Venue name" required />
      </div>

      {/* Row 3: Price + Tickets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="input-label">Price (USD) <span className="text-red-400">*</span></label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-mono">$</span>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="0"
              min="0"
              step="0.01"
              className="input-field pl-7"
            />
          </div>
        </div>
        <InputField label="Total Tickets" name="totalTickets" type="number" placeholder="100" min="1" required />
        <InputField label="Available Tickets" name="availableTickets" type="number" placeholder="Auto-fill from total" min="0" />
      </div>

      {/* Image URL */}
      <InputField label="Image URL (optional)" name="imageUrl" type="url" placeholder="https://…" />

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary min-w-[140px]">
          {loading ? (
            <><ButtonLoader /> {isEdit ? "Updating…" : "Creating…"}</>
          ) : (
            isEdit ? "Update Event" : "Create Event"
          )}
        </button>
        {!isEdit && (
          <button
            type="button"
            onClick={() => { setForm(EMPTY_FORM); setError(""); setSuccess(""); }}
            className="btn-secondary"
          >
            Clear
          </button>
        )}
      </div>
    </form>
  );
};

export default EventForm;

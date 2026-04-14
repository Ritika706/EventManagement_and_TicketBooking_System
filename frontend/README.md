# 🎟 Eventra — Event Management & Ticket Booking Frontend

A complete, production-ready React.js frontend for an Event Management and Ticket Booking System. Built with **React 18**, **React Router v6**, **Axios**, and **Tailwind CSS**.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Backend required:** Ensure your Express/Node.js backend is running at `http://localhost:5000/api`. Update `REACT_APP_API_URL` in `.env` to change this.

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── Alert.jsx           # Success/error/warning/info banners
│   ├── BookingForm.jsx     # Ticket quantity selector + confirm
│   ├── EventCard.jsx       # Event summary card (user + admin modes)
│   ├── EventForm.jsx       # Create/edit event form (admin)
│   ├── Loader.jsx          # Spinner, skeleton, button loader
│   ├── Navbar.jsx          # Adaptive nav (user/admin/guest)
│   └── ProtectedRoute.jsx  # Route guard (auth + role)
│
├── pages/
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   ├── HomePage.jsx          # Event listing + search/filter
│   ├── EventDetailsPage.jsx
│   ├── BookingPage.jsx
│   ├── MyBookingsPage.jsx
│   └── admin/
│       ├── AdminLoginPage.jsx
│       ├── AdminDashboard.jsx
│       ├── CreateEventPage.jsx
│       ├── ManageEventsPage.jsx  # Edit/delete with modals
│       └── ViewBookingsPage.jsx  # Paginated bookings table
│
├── services/
│   ├── api.js    # Axios instance + all API endpoints
│   └── auth.js   # JWT helpers (save/clear/get/isAdmin)
│
├── App.js        # React Router v6 route config
├── index.js      # ReactDOM entry point
└── index.css     # Tailwind + global styles
```

---

## 🔌 API Endpoints Used

| Method | Endpoint                  | Description               |
|--------|---------------------------|---------------------------|
| POST   | `/auth/signup`            | Register new user         |
| POST   | `/auth/login`             | Login (user + admin)      |
| GET    | `/events`                 | List all events           |
| GET    | `/events/:id`             | Get single event          |
| POST   | `/create-event`           | Create event (admin)      |
| PUT    | `/events/:id`             | Update event (admin)      |
| DELETE | `/events/:id`             | Delete event (admin)      |
| POST   | `/book-ticket`            | Book tickets              |
| GET    | `/bookings`               | All bookings (admin)      |
| GET    | `/bookings/:userId`       | User's bookings           |
| DELETE | `/bookings/:id`           | Cancel booking            |

---

## 👤 User Roles

### Customer (User)
- Browse and search events on the **Home Page**
- View **Event Details** with date, venue, ticket availability
- **Book tickets** with quantity selection
- View all their bookings in **My Bookings**

### Admin (Event Organizer)
- Separate **Admin Login** portal
- **Dashboard** with stats (events, bookings, revenue)
- **Create, edit, and delete** events
- **View all bookings** with search, filter, sort, and pagination

---

## 🎨 Design System

| Token        | Value                    |
|--------------|--------------------------|
| Background   | `#0a0a12` (deep ink)     |
| Accent       | `#f59e0b` (amber gold)   |
| Highlight    | `#ff6b35` (ember orange) |
| Teal         | `#14b8a6`                |
| Font Display | Playfair Display         |
| Font Body    | DM Sans                  |
| Font Mono    | DM Mono                  |

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🔐 Authentication Flow

<<<<<<< HEAD
1. User logs in → receives `{ token, user }` from API
2. Token and user object saved to `localStorage`
3. Axios interceptor attaches `Authorization: Bearer <token>` to all requests
4. On 401 response → auto-logout and redirect to `/login`
5. `ProtectedRoute` checks `localStorage` for valid token and role
=======
1. Login → verify credentials → generate JWT → send `{ token, user }`
2. Token and user object saved to `localStorage`
3. Role check → redirect user to `/` or admin to `/admin/dashboard`
4. Axios interceptor attaches `Authorization: Bearer <token>` to protected API calls
5. On `401` response → auto-logout and redirect to `/login` (or `/admin/login` for admin pages)
6. `ProtectedRoute` checks `localStorage` for valid token and role

### ✅ Perfect Auth Flow (Diagram)

```mermaid
flowchart TD
	%% Signup
	A[Signup] --> B[Hash Password (bcrypt)]
	B --> C[Save User in DB]
	C --> D[Success]

	%% Login
	E[Login] --> F[Verify Email + Password]
	F -->|OK| G[Generate JWT]
	G --> H[Send token + user]
	H --> I[Store token/user in frontend (localStorage)]
	I --> J{Role Check}
	J -->|user| K[Redirect: / (Event List)]
	J -->|admin| L[Redirect: /admin/dashboard]
	I --> M[Use token in protected APIs\nAuthorization: Bearer <token>]

	%% Forgot password
	N[Forgot Password] --> O[Generate Reset Token]
	O --> P[Save SHA-256 Hash + Expiry in DB\n(not plain token)]
	P --> Q[Send Reset Link via Email]

	%% Reset password
	R[Reset Password] --> S[Verify Token Hash + Expiry]
	S --> T[Update Password (bcrypt)]
	T --> U[Success]
	U --> V[Redirect to Login]
```

### Error Handling (Examples)

- Invalid email (login / forgot password) → `404`
- Wrong password → `401`
- Expired reset token → shows an error message (e.g. "Reset token expired")
>>>>>>> dev

---

## 📦 Dependencies

| Package             | Purpose                     |
|---------------------|-----------------------------|
| `react` 18          | UI library                  |
| `react-router-dom` 6| Client-side routing         |
| `axios`             | HTTP client with interceptors|
| `tailwindcss` 3     | Utility-first CSS           |
| `react-scripts` 5   | CRA build tooling           |

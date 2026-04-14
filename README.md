# Eventra - Event Management & Ticket Booking System

A comprehensive event management and ticket booking system built with modern web technologies.

## Project Structure

```
Eventra/
├── backend/        # Node.js/Express backend server
├── frontend/       # React frontend application
└── README.md       # This file
```

## Backend

- **Framework**: Express.js (Node.js)
- **Database**: MongoDB
- **Location**: `/backend`
- **Key Features**:
  - Authentication & Authorization
  - Event Management
  - Booking System
  - Email notifications

### Backend Setup

```bash
cd backend
npm install
npm start
```

Environment variables needed in `.env`:
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `EMAIL_USER` - Email service credentials
- `EMAIL_PASS` - Email service password

## Frontend

- **Framework**: React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Location**: `/frontend`
- **Key Features**:
  - User authentication
  - Event discovery & browsing
  - Event booking
  - Admin dashboard

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Environment variables needed in `.env`:
- `VITE_API_URL` - Backend API URL

## Features

- 🎫 Event creation and management
- 👥 User authentication and profiles
- 📅 Event bookings and reservations
- 💌 Email notifications
- 🔐 Secure authentication
- 📊 Admin dashboard
- 🎨 Responsive UI

## Git Workflow

- **main** - Production-ready code
- **dev** - Development branch
- **feature-*** - Feature branches

## Contributing

1. Create a feature branch from `dev`
2. Make your changes
3. Submit a pull request to `dev`
4. After review, merge to `main`

## License

This project is licensed under the MIT License.

# 🏥 KineticCare

A full-stack MERN healthcare appointment booking platform that enables users to browse healthcare services, book appointment slots, manage bookings, and authenticate using Email/Password or Google OAuth. The application also includes a secure Admin Dashboard for managing services, appointment slots, and bookings.

---

# 🌐 Live Demo

### Frontend
https://your-frontend-url.vercel.app

### Backend API
https://your-backend-url.vercel.app/api/v1

---

# ✨ Features

## User Features

- User Registration & Login
- Google OAuth Login
- JWT Authentication
- Secure Cookie Authentication
- Browse Healthcare Services
- Search & Filter Services
- View Service Details
- Book Appointment Slots
- View Booking History
- Cancel Bookings
- Update Profile
- Change Password
- Forgot Password
- Reset Password
- Email Notifications

---

## Admin Features

- Admin Dashboard
- Dashboard Analytics
- Manage Services
- Create Services
- Update Services
- Delete Services
- Create Slots
- Update Slots
- Delete Slots
- Manage Bookings
- Monitor Appointment Status

---

# 🛠 Tech Stack

## Frontend

- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- TanStack Query
- React Hook Form
- Framer Motion
- React Hot Toast
- Lucide React
- Google OAuth

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Cookie Parser
- Helmet
- Express Validator
- Google Auth Library
- Brevo Email API
- Morgan

---

# 📂 Project Structure

```
KineticCare
│
├── frontend
│   ├── public
│   ├── src
│   │
│   ├── assets
│   ├── components
│   ├── context
│   ├── hooks
│   ├── layouts
│   ├── pages
│   ├── routes
│   ├── services
│   ├── utils
│   └── App.jsx
│
├── backend
│
│   ├── src
│   │
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── validators
│   ├── utils
│   ├── app.js
│   └── server.js
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/KineticCare.git

cd KineticCare
```

---

# Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file inside the backend directory.

Example:

```env
PORT=5000

NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret

JWT_EXPIRES_IN=15m

REFRESH_TOKEN_SECRET=your_refresh_secret

REFRESH_TOKEN_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173

BREVO_API_KEY=your_api_key

BREVO_SENDER_EMAIL=your_email

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Run backend

```bash
npm run dev
```

Backend runs at

```
http://localhost:5000
```

---

# Frontend Setup

```bash
cd frontend

npm install
```

Create `.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1

VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Run

```bash
npm run dev
```

Frontend runs at

```
http://localhost:5173
```

---

# Authentication

KineticCare supports two authentication methods.

## Email Authentication

- Register
- Login
- Forgot Password
- Reset Password

---

## Google OAuth

Google Sign-In is implemented using

```
@react-oauth/google
```

Backend verifies the Google ID Token using

```
google-auth-library
```

---

# Security Features

- JWT Authentication
- Secure Cookies
- Password Hashing using bcrypt
- Helmet
- Input Validation
- Protected Routes
- Role-based Authorization
- HTTP-only Cookies
- Environment Variables

---

# Database Schema

## User

```
User
│
├── name
├── email
├── password
├── avatar
├── role
├── googleId
├── refreshToken
├── createdAt
└── updatedAt
```

---

## Service

```
Service
│
├── name
├── category
├── description
├── duration
├── price
├── image
├── isActive
└── timestamps
```

---

## Slot

```
Slot
│
├── service
├── date
├── startTime
├── endTime
├── maxBookings
├── availableBookings
└── timestamps
```

---

## Booking

```
Booking
│
├── user
├── service
├── slot
├── bookingStatus
├── paymentStatus
├── notes
└── timestamps
```

---

# Application Flow

```
User

↓

Authentication

↓

Browse Services

↓

Select Slot

↓

Book Appointment

↓

Booking Stored

↓

Confirmation Email Sent

↓

Booking History Updated
```

---

# API Overview

## Authentication

```
POST /auth/register

POST /auth/login

POST /auth/google

POST /auth/logout

POST /auth/forgot-password

POST /auth/reset-password

GET /auth/me
```

---

## Services

```
GET /services

GET /services/:id

POST /services

PUT /services/:id

DELETE /services/:id
```

---

## Slots

```
GET /slots

POST /slots

PUT /slots/:id

DELETE /slots/:id
```

---

## Bookings

```
POST /bookings

GET /bookings

PATCH /bookings/:id/cancel
```

---

# Testing Checklist

## User

- Register
- Login
- Google Login
- Forgot Password
- Reset Password
- Browse Services
- Book Appointment
- Cancel Booking
- Logout

---

## Admin

- Login
- Create Service
- Update Service
- Delete Service
- Create Slot
- Update Slot
- Delete Slot
- View Dashboard
- Manage Bookings

---

# Deployment

Frontend

- Vercel

Backend

- Vercel

Database

- MongoDB Atlas

Email

- Brevo

Authentication

- Google OAuth

---

# Future Improvements

- Refresh Token Rotation
- Payment Gateway Integration
- Doctor Profiles
- Appointment Reminders
- Notifications
- Real-time Slot Availability
- Audit Logs
- Multi-language Support

---

# Author

**Mihir Parida**

B.Tech Computer Science & Engineering

GIFT Autonomous, Bhubaneswar

GitHub

https://github.com/Mihir09CS

Portfolio

https://mihirparida.netlify.app

---

# License

This project is developed for educational purposes and technical assessment.

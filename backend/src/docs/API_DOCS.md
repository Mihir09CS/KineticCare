# KineticCare Backend — Production API Documentation

KineticCare is a production-quality MERN Stack Smart Senior Wellness Booking Platform providing user authentication, profile management, senior wellness service browsing, slot scheduling, race-condition safe appointment booking, automated Brevo email notifications, and dashboard analytics.

---

## Base URL
```
http://localhost:5000/api/v1
```

---

## Authentication & Headers

- **JSON Body**: `Content-Type: application/json`
- **Bearer Token**: Pass JWT token in request headers:
  ```http
  Authorization: Bearer <access_token>
  ```
- **HttpOnly Cookie**: Access token is also automatically set and read via `accessToken` cookie.

---

## Standard Response Format

### Success Response (`200 OK`, `201 Created`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation description",
  "data": { ... }
}
```

### Error Response (`400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`)
```json
{
  "success": false,
  "message": "Error description message"
}
```

---

## Table of Contents
1. [Authentication & Profile APIs](#1-authentication--profile-apis)
2. [Service Management APIs](#2-service-management-apis)
3. [Slot Management APIs](#3-slot-management-apis)
4. [Booking Module APIs](#4-booking-module-apis)
5. [Dashboard APIs](#5-dashboard-apis)

---

## 1. Authentication & Profile APIs

### Register User
- **Method**: `POST`
- **URL**: `/auth/register`
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "Password123!"
  }
  ```
- **Responses**:
  - `201 Created`: User registered successfully.
  - `400 Bad Request`: Validation error.
  - `409 Conflict`: User already exists.

### Login User
- **Method**: `POST`
- **URL**: `/auth/login`
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "Password123!"
  }
  ```
- **Responses**:
  - `200 OK`: Login successful. Sets `accessToken` & `refreshToken` HttpOnly cookies.

### Get Current User Profile
- **Method**: `GET`
- **URL**: `/auth/me`
- **Auth**: Required (`USER` / `ADMIN`)
- **Responses**:
  - `200 OK`: User profile object.

### Update Profile
- **Method**: `PATCH`
- **URL**: `/auth/profile`
- **Auth**: Required
- **Request Body**:
  ```json
  {
    "name": "Jane Smith"
  }
  ```

### Change Password
- **Method**: `PATCH`
- **URL**: `/auth/change-password`
- **Auth**: Required
- **Request Body**:
  ```json
  {
    "currentPassword": "Password123!",
    "newPassword": "NewPassword123!"
  }
  ```

### Forgot Password
- **Method**: `POST`
- **URL**: `/auth/forgot-password`
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "email": "jane@example.com"
  }
  ```

### Reset Password
- **Method**: `POST`
- **URL**: `/auth/reset-password/:token`
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "password": "NewPassword123!"
  }
  ```

### Logout User
- **Method**: `POST`
- **URL**: `/auth/logout`
- **Auth**: Required
- **Responses**:
  - `200 OK`: Clears authentication cookies.

---

## 2. Service Management APIs

### Get All Services
- **Method**: `GET`
- **URL**: `/services`
- **Auth**: Public
- **Query Parameters**:
  - `page` (optional, default `1`)
  - `limit` (optional, default `10`)
  - `search` (optional, partial match across name, description, category)
  - `category` (optional, e.g. `Physiotherapy`, `Yoga`)
  - `isActive` (optional, default `true`)
- **Responses**:
  - `200 OK`: Paginated list of services.

### Get Service By ID
- **Method**: `GET`
- **URL**: `/services/:id`
- **Auth**: Public
- **Responses**:
  - `200 OK`: Service object.
  - `404 Not Found`: Service not found.

### Create Service
- **Method**: `POST`
- **URL**: `/services`
- **Auth**: Required (`ADMIN` only)
- **Request Body**:
  ```json
  {
    "name": "Senior Hydrotherapy",
    "description": "Low-impact water exercise session for joint pain relief.",
    "category": "Hydrotherapy",
    "duration": 45,
    "price": 35.00,
    "imageUrl": "https://example.com/hydro.jpg"
  }
  ```
- **Responses**:
  - `201 Created`: Service document.
  - `409 Conflict`: Service with this name already exists.

### Update Service
- **Method**: `PUT`
- **URL**: `/services/:id`
- **Auth**: Required (`ADMIN` only)
- **Request Body**: Partial service fields (`name`, `description`, `price`, `isActive`, etc.)

### Delete Service (Soft Delete)
- **Method**: `DELETE`
- **URL**: `/services/:id`
- **Auth**: Required (`ADMIN` only)
- **Responses**:
  - `200 OK`: Sets `isActive: false`.

---

## 3. Slot Management APIs

### Get Slots By Service
- **Method**: `GET`
- **URL**: `/slots/service/:serviceId`
- **Auth**: Public
- **Query Parameters**:
  - `date` (optional, format `YYYY-MM-DD`)
- **Responses**:
  - `200 OK`: List of active, upcoming slots.

### Get Slot By ID
- **Method**: `GET`
- **URL**: `/slots/:id`
- **Auth**: Public

### List All Slots (Admin)
- **Method**: `GET`
- **URL**: `/slots`
- **Auth**: Required (`ADMIN` only)
- **Query Parameters**: `serviceId`, `date`, `status`, `isActive`, `page`, `limit`

### Create Slot
- **Method**: `POST`
- **URL**: `/slots`
- **Auth**: Required (`ADMIN` only)
- **Request Body**:
  ```json
  {
    "service": "64f1a2b3c4d5e6f7a8b9c0d1",
    "date": "2026-08-20",
    "startTime": "10:00",
    "endTime": "11:00",
    "maxBookings": 5
  }
  ```
- **Responses**:
  - `201 Created`: Slot created with initial `availableBookings: 5` and `status: "open"`.
  - `409 Conflict`: Duplicate slot for same service, date, and startTime.

### Update Slot
- **Method**: `PUT`
- **URL**: `/slots/:id`
- **Auth**: Required (`ADMIN` only)
- **Request Body**: Fields to update (e.g. `maxBookings`, `startTime`, `status`, `isActive`)

### Delete Slot (Soft Delete)
- **Method**: `DELETE`
- **URL**: `/slots/:id`
- **Auth**: Required (`ADMIN` only)
- **Responses**:
  - `200 OK`: Sets `isActive: false` and `status: "cancelled"`.

---

## 4. Booking Module APIs

### Create Booking
- **Method**: `POST`
- **URL**: `/bookings`
- **Auth**: Required (`USER` / `ADMIN`)
- **Request Body**:
  ```json
  {
    "service": "64f1a2b3c4d5e6f7a8b9c0d1",
    "slot": "64f1a2b3c4d5e6f7a8b9c0d2",
    "notes": "Please provide wheelchair assistance."
  }
  ```
- **Responses**:
  - `201 Created`: Booking created, slot `availableBookings` decremented, confirmation email sent via Brevo.
  - `409 Conflict`: Double booking or slot full/unavailable.

### Get My Bookings (History)
- **Method**: `GET`
- **URL**: `/bookings/my`
- **Auth**: Required (`USER` / `ADMIN`)
- **Query Parameters**: `page`, `limit`, `status` (`Confirmed`, `Cancelled`, `Completed`, `Pending`)

### Get My Upcoming Bookings
- **Method**: `GET`
- **URL**: `/bookings/my/upcoming`
- **Auth**: Required (`USER` / `ADMIN`)
- **Responses**:
  - `200 OK`: List of upcoming active confirmed bookings.

### Get Booking By ID
- **Method**: `GET`
- **URL**: `/bookings/:id`
- **Auth**: Required (Owner or `ADMIN`)

### Cancel Booking
- **Method**: `PATCH`
- **URL**: `/bookings/:id/cancel`
- **Auth**: Required (Owner or `ADMIN`)
- **Responses**:
  - `200 OK`: Booking status set to `Cancelled`, slot `availableBookings` incremented by 1, cancellation email sent.

### Get All Bookings (Admin)
- **Method**: `GET`
- **URL**: `/bookings`
- **Auth**: Required (`ADMIN` only)
- **Query Parameters**: `page`, `limit`, `status`, `serviceId`

---

## 5. Dashboard APIs

### Get User Dashboard Metrics
- **Method**: `GET`
- **URL**: `/dashboard/user`
- **Auth**: Required (`USER` / `ADMIN`)
- **Responses**:
  - `200 OK`:
    ```json
    {
      "success": true,
      "data": {
        "stats": {
          "totalBookings": 8,
          "confirmedBookings": 5,
          "cancelledBookings": 1,
          "completedBookings": 2
        },
        "upcomingBookings": [ ... ],
        "recentHistory": [ ... ]
      }
    }
    ```

### Get Admin Dashboard Metrics
- **Method**: `GET`
- **URL**: `/dashboard/admin`
- **Auth**: Required (`ADMIN` only)
- **Responses**:
  - `200 OK`:
    ```json
    {
      "success": true,
      "data": {
        "stats": {
          "totalUsers": 120,
          "totalServices": 10,
          "totalSlots": 45,
          "totalBookings": 310
        },
        "todaysAppointments": [ ... ],
        "upcomingAppointments": [ ... ]
      }
    }
    ```

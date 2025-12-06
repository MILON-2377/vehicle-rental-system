# Vehicle Rental System API

**Backend (Express + TypeScript + PostgreSQL)**

A production-ready Vehicle Rental Management Backend built using Express.js, TypeScript, and PostgreSQL (Neon).
The system includes User Authentication, Vehicle Management, Booking System, and Automatic Booking Status Updates.

## Live URL

https://vehicle-rental-system-rust.vercel.app

---

## Project Name

**Vehicle Rental System - Backend API**

---

## Features

- JWT-based authentication (Signup/Login)
- Role-based authorization (Admin, User)
- User profile management
- Vehicle CRUD with availability management
- Booking system with auto price calculation
- Auto job to update expired bookings
- PostgreSQL + Neon serverless database
- Organized modular architecture
- Fully written in TypeScript

---

## Tech Stack

- Express.js
- Typescript
- PorstgreSQL + Neon DB
- pg (PostgreSQL client)
- dotenv for environment variables
- cors

---

## Project Structure

    src/
    |----api
    |----config
    |----db
    |----middlwares
    |----modules
    |----utils
    |----app.ts
    |----server.ts

---

## Authentication Endpoints

    Method    | Endpoint      |Access   |Description
    POST | /api/v1/auth/signup | Public | Register new user
    POST | /api/v1/auth/signin | Public | Login & get JWT token

---

## Vehicle Endpoints

    Method | Endpoint | Access | Description
    POST | /api/v1/vehicles | Admin only |	Add new vehicle
    GET	| /api/v1/vehicles | Public | View all vehicles
    GET | /api/v1/vehicles/:vehicleId |	Public | Vehicle details
    PUT | /api/v1/vehicles/:vehicleId | Admin only | Update vehicle
    DELETE | /api/v1/vehicles/:vehicleId |	Admin only | Delete vehicle (if no active bookings)

---

## User Endpoints

    Method | Endpoint | Access | Description
    GET | /api/v1/users | Admin only | View all users
    PUT | /api/v1/users/:userId | Admin/User | Admin: update any user, User: update self
    DELETE | /api/v1/users/:userId | Admin only | Delete user (if no active bookings)

---

## Booking Endpoints

    Method | Endpoint | Access | Description
    POST | /api/v1/bookings | User/Admin | Create booking, validate availability, calculate price, mark vehicle as booked
    GET | /api/v1/bookings | Role-based | Admin: All bookings, User: Own bookings
    PUT | /api/v1/bookings/:bookingId |Role-based | User: Cancel (only before start date), Admin: Mark returned

---

## Auto System Behavior

- Bookings automatically marked as returned when date expires.
- Vehicle availability resets to available.

---

## Setup Instructions

1. Clone the repository
   ```bash
   git clone [https://github.com/MILON-2377/vehicle-rental-system.git]
   ```
2. Install dependencies
   ```bash
    ipm install
   ```
3. Setup environment variables
   ```bash
   PORT=8080
   DATABASE_URL=your_neon_db_url
   JWT_SECRET=your_secret
   ```
4. Build the project
   ```bash
   npm run build
   ```
5. Start production server
   ```bash
   npm start
   ```
6. Start in development
   ```bash
   npm run dev
   ```

---

## Deployment (Railway Example)

- Push code to GitHub
- Go to https://railway.app
- Create New Project → Deploy from GitHub
- Add environment variables
- Add Start Command: npm run start

---

## Author

-MILON MIAH

-- Create User Table
CREATE TYPE user_role AS ENUM('customer', 'admin');
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email TEXT NOT NULL UNIQUE CHECK(email = LOWER(email)),
    password TEXT NOT NULL,
    phone VARCHAR(14) NOT NULL,
    role user_role DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create Vehicle Table
CREATE TYPE vehicle_type as ENUM('car', 'bike', 'van', 'SUV');
CREATE TYPE availability_status as ENUM('available', 'booked');
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(100) NOT NULL,
    type vehicle_type NOT NULL,
    registration_number VARCHAR(50) NOT NULL UNIQUE,  
    daily_rent_price INT NOT NULL CHECK(daily_rent_price >= 0),
    availability_status availability_status DEFAULT 'available'
);

-- Create Booking Table
CREATE TYPE booking_status AS ENUM('active', 'cancelled', 'returned');
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,  
    rent_start_date DATE NOT NULL,
    rent_end_date DATE NOT NULL,
    total_price INT NOT NULL CHECK(total_price > 0),
    status booking_status DEFAULT 'active',
    CHECK(rent_end_date > rent_start_date)
);
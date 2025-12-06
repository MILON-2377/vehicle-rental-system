
-- Enum Types
DROP TYPE IF EXISTS user_role CASCADE;
CREATE TYPE user_role AS ENUM ('customer', 'admin');

DROP TYPE IF EXISTS vehicle_type CASCADE;
CREATE TYPE vehicle_type AS ENUM ('car', 'bike', 'van', 'SUV');

DROP TYPE IF EXISTS availability_status CASCADE;
CREATE TYPE availability_status AS ENUM ('available', 'booked');

DROP TYPE IF EXISTS booking_status CASCADE;
CREATE TYPE booking_status AS ENUM ('active', 'cancelled', 'returned');

-- Create User Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email TEXT NOT NULL UNIQUE CHECK (email = LOWER(email)),
    password TEXT NOT NULL,
    phone VARCHAR(14) NOT NULL,
    role user_role NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create Vehicle Table
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(100) NOT NULL,
    type vehicle_type NOT NULL,
    registration_number VARCHAR(50) NOT NULL UNIQUE,
    daily_rent_price INT NOT NULL CHECK (daily_rent_price >= 0),
    availability_status availability_status NOT NULL DEFAULT 'available',
    created_at TIMESTAMP DEFAULT NOW()
);


-- Create Booking Table
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    rent_start_date DATE NOT NULL,
    rent_end_date DATE NOT NULL,
    total_price INT NOT NULL CHECK (total_price > 0),
    status booking_status NOT NULL DEFAULT 'active',
    CHECK (rent_end_date > rent_start_date),
    created_at TIMESTAMP DEFAULT NOW()
);

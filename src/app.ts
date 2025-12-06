import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());


app.use(cors({
    origin: "*"
}))

// Health Route
import HealthRoute from "./modules/health/routes/health.routes";
app.use("/api/v1/health", HealthRoute);

// Auth Route
import AuthRoute from "./modules/auth/routes/auth.routes";
app.use("/api/v1/auth", AuthRoute);


// User Route
import UserRoute from "./modules/user/routes/user.routes";
app.use("/api/v1/users", UserRoute);


// Vehicle Route
import VehicleRoute from "./modules/vehicle/routes/vehicle.routes";
app.use("/api/v1/vehicles", VehicleRoute);


// Booking Route
import BookingRoute from "./modules/booking/routes/booking.routes";
app.use("/api/v1/bookings", BookingRoute);


export default app;
import { Router } from "express";
import BookingController from "../controller/booking.controller";
import Authenticate from "../../../middlewares/auth.middleware";


const router = Router();

router.use(Authenticate.authentication, Authenticate.authorization("customer", "admin"));

router.get("/", BookingController.getVehicles);
router.post("/", BookingController.createBooking);
router.put("/:bookingId", BookingController.updateBooking);








export default router;
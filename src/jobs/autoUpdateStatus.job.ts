import cron from "node-cron";
// import BookingService from "../modules/booking/service/booking.service";
import pool from "../db";

cron.schedule("0 2 * * *", async () => {
  try {
    const vehiclesUpdated = await pool.query(
      `
        UPDATE
             vehicles v
        SET 
            availability_status = 'available'
        FROM 
            bookings b
        WHERE
            v.id = b.vehicle_id
            AND b.rend_end_date < CURRENT_DATE
            AND b.status = 'active'
        `
    );

    const bookingsUpdated = await pool.query(
      `
        UPDATE
             bookings
        SET
            status = 'returned'
        WHERE
            rend_end_date < CURRENT_DATE
            AND status = 'active' 
        `
    );

    // const bookings = await BookingService.getBookings();

    // const bookingEndIds = bookings.reduce((acc: number[], booking) => {
    //   const today = new Date();
    //   today.setHours(0, 0, 0, 0);
    //   const bookingEndDate = new Date(booking.rent_end_date);
    //   const bookingEndDateTime = bookingEndDate.getTime();
    //   const todayTime = today.getTime();

    //   const bookingId = booking.id;

    //   if (todayTime > bookingEndDateTime) {
    //     acc.push(bookingId!);
    //   }

    //   return acc;
    // }, []);

    // for (const bookingId of bookingEndIds) {

    //   const bookingUpdatePayload = {
    //     bookingId,
    //     status: "returned",
    //   };
    //   await BookingService.updateBooking(bookingUpdatePayload);
    // }
  } catch (error) {
    console.error("Error during automatic return:", error);
  }
});

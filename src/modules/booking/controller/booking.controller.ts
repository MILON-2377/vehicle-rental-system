import { Request, Response, NextFunction } from "express";
import asyncHandler from "../../../middlewares/asyncHandler";
import ApiResponse from "../../../utils/ApiResponse";
import BookingService from "../service/booking.service";
import VehicleService from "../../vehicle/service/vehicle.service";

export default class BookingController {
  // Get Vehicles
  public static getVehicles = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const currentUser = req.user;

      let vehicles;
      if (currentUser?.role?.toLowerCase() === "admin") {
        vehicles = await BookingService.getBookings();
      }

      if (currentUser?.role?.toLowerCase() === "customer") {
        vehicles = await BookingService.getBooking(Number(currentUser.userId));
      }

      return res
        .status(200)
        .json(ApiResponse.ok(vehicles, "Bookings retrived successfully"));
    }
  );

  // Create Booking
  public static createBooking = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const body = req.body;
      const bookingKeys = Object.keys(body);
      const currentUser = req.user;

      if (bookingKeys.length === 0) {
        return res
          .status(400)
          .json(
            ApiResponse.badRequest("Create booking payload can not be empty")
          );
      }

      if (bookingKeys.some((key) => body[key] === undefined)) {
        return res
          .status(400)
          .json(
            ApiResponse.badRequest(
              "Create booking required fields must have a valid value"
            )
          );
      }

      if (
        typeof body.customer_id !== "number" ||
        typeof body.vehicle_id !== "number"
      ) {
        return res
          .status(400)
          .json(
            ApiResponse.badRequest(
              "Bad request: customer Id and vehicle Id must be a number"
            )
          );
      }

      const bookingStartDate = new Date(body.rent_start_date);
      const bookingEndDate = new Date(body.rent_end_date);

      if (bookingEndDate.getTime() < bookingStartDate.getTime()) {
        return res
          .status(400)
          .json(
            ApiResponse.badRequest(
              "Bad request: Booking end date must be after begain booking "
            )
          );
      }

      if (Number(currentUser?.userId) !== Number(body.customer_id)) {
        return res
          .status(403)
          .json(
            ApiResponse.forbidden(
              "Forbidden: You are not allowed. Please provide a valid user Id"
            )
          );
      }

      const isVehicleExists = await VehicleService.getVehicleById(
        String(body.vehicle_id)
      );

      if (!isVehicleExists) {
        return res
          .status(404)
          .json(
            ApiResponse.notFound(
              "Given vehicle Id not found. Please provide a valid vehicle Id"
            )
          );
      }

      const isVehicleAvailable = isVehicleExists.availability_status;

      if (isVehicleAvailable.toLowerCase() === "booked") {
        return res
          .status(400)
          .json(ApiResponse.badRequest("The vehicle not available."));
      }

      const newBooking = await BookingService.createBooking(body);

      return res
        .status(201)
        .json(ApiResponse.created(newBooking, "Booking created successfully"));
    }
  );

  // Update Booking
  public static updateBooking = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { bookingId } = req.params;
      const currentUser = req.user;
      const body = req.body;
      const updateBookingKeys = Object.keys(body);

      if (!bookingId) {
        return res
          .status(400)
          .json(
            ApiResponse.badRequest(
              "Bad request: Update booking must have a valid booking Id"
            )
          );
      }

      if (
        updateBookingKeys.some(
          (key) => body[key] === undefined || body[key].trim().length === 0
        )
      ) {
        return res
          .status(400)
          .json(
            ApiResponse.badRequest(
              "Bad request: Update booking status must have a valid value"
            )
          );
      }

      if (!["cancelled", "returned"].includes(body.status)) {
        return res
          .status(400)
          .json(ApiResponse.badRequest("Invalid status type"));
      }

      const role = currentUser?.role;

      const isBookingExists = await BookingService.getSingleBooking(
        Number(bookingId)
      );

      if (!isBookingExists) {
        return res
          .status(404)
          .json(
            ApiResponse.notFound(
              "Not found: Booking not found. Please provide a valid booking Id"
            )
          );
      }

      const updateBookingPayload = {
        bookingId: Number(bookingId),
        status: String(body.status),
      };

      const bookingStartDate = new Date(isBookingExists.rent_start_date);
      const today = new Date();
      today.setHours(0,0,0,)
      const bookingStartTime = bookingStartDate.getTime();
      const todayTime = today.getTime();

      if (
        currentUser?.role?.toLowerCase() === "customer" &&
        bookingStartTime > todayTime
      ) {
        const updatedBookingByCustomer =
          await BookingService.updateBookingByCustomer(updateBookingPayload);

        return res
          .status(200)
          .json(
            ApiResponse.ok(
              updatedBookingByCustomer,
              `Booking ${body.status} successfully`
            )
          );
      }

      if(body.status.toLowerCase() === "cancelled"){
        return res.status(400).json(ApiResponse.badRequest("Invalid status"))
      }

      const updatedBooking = await BookingService.updateBooking(
        updateBookingPayload
      );

      return res
        .status(200)
        .json(
          ApiResponse.ok(updatedBooking, `Booking ${body.status} successfully`)
        );
    }
  );
}

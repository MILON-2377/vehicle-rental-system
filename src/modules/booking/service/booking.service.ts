import pool from "../../../db";
import VehicleService from "../../vehicle/service/vehicle.service";
import BookingHelper from "../helper/booking.helper";
import IBooking, {
  ICreateBookingRes,
  IUpdateBookingPayload,
} from "../types/booking.types";

export default class BookingService {
  // Get Single Booking By bookingId
  public static getSingleBooking = async (
    bookingId: number
  ): Promise<IBooking> => {
    try {
      const res = await pool.query(
        `
                SELECT * FROM bookings WHERE id=$1
                `,
        [bookingId]
      );

      return res.rows[0];
    } catch (error) {
      console.error(
        "Database error occured during fetching single booking: ",
        error
      );
      throw new Error(
        `Database error occured during fetching single booking: ${error}`
      );
    }
  };

  // Get Booking Status By User Id
  public static getBookingStatusByUserId = async (
    userId: number
  ): Promise<Partial<IBooking>> => {
    try {
      const booking = await pool.query(
        `
        SELECT 
              b.status
        FROM 
            bookings b
        LEFT JOIN
                users u ON u.id = b.customer_id
        WHERE 
            b.customer_id = $1
        `,
        [userId]
      );

      return booking.rows[0];
    } catch (error) {
      console.error(
        "Database error occured during fetching booking status: ",
        error
      );
      throw new Error(
        `Database error occured during fetching booking status: ${error}`
      );
    }
  };

  // Ge Booking
  public static getBooking = async (
    userId: number
  ): Promise<Partial<IBooking>> => {
    try {
      const vehicle = await pool.query(
        `
            SELECT
                b.id,
                b.customer_id,
                b.vehicle_id,
                TO_CHAR(b.rent_start_date, 'YYYY-MM-DD') AS rent_start_date,
                TO_CHAR(b.rent_end_date, 'YYYY-MM-DD') AS rent_end_date,
                b.total_price,
                b.status,
                json_build_object(
                    'vehicle_name', v.vehicle_name,
                    'registration_number', v.registration_number,
                    'type', v.type  
                ) AS vehicle
            FROM
                bookings b
            LEFT JOIN
                users u  ON u.id = b.customer_id
            LEFT JOIN
                vehicles v ON v.id = b.vehicle_id
            WHERE b.customer_id = $1;
            `,
        [userId]
      );

      return vehicle.rows[0];
    } catch (error) {
      console.error(
        "Databse error occured during fetching single booking: ",
        error
      );
      throw new Error(
        `Databse error occured during fetching single booking: ${error}`
      );
    }
  };

  // Get Bookings
  public static getBookings = async (): Promise<IBooking[]> => {
    try {
      const res = await pool.query(
        `
        SELECT
        b.id,
        b.customer_id,
        b.vehicle_id,
        TO_CHAR(b.rent_start_date, 'YYYY-MM-DD') AS rent_start_date,
        TO_CHAR(b.rent_end_date, 'YYYY-MM-DD') AS rent_end_date,
        b.total_price,
        b.status,
        json_build_object(
            'name', u.name,
            'email', u.email
        ) AS customer,
        json_build_object(
            'vehicle_name', v.vehicle_name,
            'registration_number', v.registration_number,
            'daily_rent_price', v.daily_rent_price  -- Added this useful field
        ) AS vehicle
        FROM
            bookings b
        LEFT JOIN
            users u ON u.id = b.customer_id
        LEFT JOIN
            vehicles v ON v.id = b.vehicle_id;
        `
      );

      return res.rows;
    } catch (error) {
      console.error("Database error occured during fetching bookings: ", error);
      throw new Error(
        `Database error occured during fetching bookings: ${error}`
      );
    }
  };

  // Create Booking
  public static createBooking = async (
    bookingPayload: IBooking
  ): Promise<ICreateBookingRes> => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } =
      bookingPayload;

    const { bookingDuration } = BookingHelper.bookingDurationCal(
      rent_start_date,
      rent_end_date
    );

    try {
      const updateVehicleStatus = await VehicleService.updateVehicle(
        vehicle_id,
        { availability_status: "booked" }
      );

      const rentVehiclePrice = updateVehicleStatus.daily_rent_price;
      const totalPrice = BookingHelper.bookingPriceCal(
        bookingDuration!,
        rentVehiclePrice
      );

      const newBooking = await pool.query(
        `INSERT INTO 
            bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) 
        VALUES
            ($1, $2, $3, $4, $5, $6) 
        RETURNING 
            id, 
            customer_id, 
            vehicle_id, 
            TO_CHAR(rent_start_date, 'YYYY-MM-DD') AS rent_start_date, 
            TO_CHAR(rent_end_date, 'YYYY-MM-DD') AS rent_end_date, 
            total_price, 
            status`,
        [
          customer_id,
          vehicle_id,
          rent_start_date,
          rent_end_date,
          totalPrice,
          "active",
        ]
      );

      return {
        ...newBooking.rows[0],
        vehicle: {
          vehicle_name: updateVehicleStatus.vehicle_name,
          daily_rent_price: updateVehicleStatus.daily_rent_price,
        },
      };
    } catch (error) {
      console.error("Error occured during creating booking: ", error);
      throw new Error(`Error occured during creating booking: ${error}`);
    }
  };

  // Update By Customer
  public static updateBookingByCustomer = async (
    payload: IUpdateBookingPayload
  ): Promise<IBooking> => {
    const { status, bookingId } = payload;
    try {
      const res = await pool.query(
        `
            UPDATE 
                bookings 
            SET 
                status=$1
            WHERE
                id=$2
            RETURNING
                id,
                customer_id,
                vehicle_id,
                TO_CHAR(rent_start_date, 'YYYY-MM-DD') AS rent_start_date,
                TO_CHAR(rent_end_date, 'YYYY-MM-DD') AS rent_end_date,
                total_price,
                status;
            `,
        [status, bookingId]
      );

      const vehicleId = res.rows[0].vehicle_id;
      await VehicleService.updateVehicle(vehicleId, {
        availability_status: "available",
      });

      return res.rows[0];
    } catch (error) {
      console.error(
        "Database error occured during booking status update by Customer: ",
        error
      );
      throw new Error(
        `Database error occured during booking status update by Customer: ${error}`
      );
    }
  };

  // Update Booking
  public static updateBooking = async (
    payload: IUpdateBookingPayload
  ): Promise<Partial<IBooking>> => {
    const { status, bookingId } = payload;
    try {
      const updatedBookingStatus = await pool.query(
        `
            UPDATE 
                bookings
            SET 
                status=$1
            WHERE
                id=$2
            RETURNING
                id,
                customer_id,
                vehicle_id,
                TO_CHAR(rent_start_date, 'YYYY-MM-DD') AS rent_start_date,
                TO_CHAR(rent_end_date, 'YYYY-MM-DD') AS rent_end_date,
                total_price,
                status;
            `,
        [status, bookingId]
      );

      const updateVehiclePayload = {
        availability_status: "available",
      };

      const vehicleId = updatedBookingStatus.rows[0].vehicle_id;
      const updatingVehicle = await VehicleService.updateVehicle(
        vehicleId,
        updateVehiclePayload
      );

      return {
        ...updatedBookingStatus.rows[0],
        vehicle: {
          availability_status: updatingVehicle.availability_status,
        },
      };
    } catch (error) {
      console.error("Database error occured during updating booking: ", error);
      throw new Error(
        `Database error occured during updating booking: ${error}`
      );
    }
  };
}

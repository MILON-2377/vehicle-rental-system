import pool from "../../../db";
import IVehicle from "../types/vehicle.types";

export default class VehicleService {
  // Get All Vehicles
  public static getVehicles = async (): Promise<IVehicle[]> => {
    try {
      const res = await pool.query(
        "SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status FROM vehicles"
      );

      return res.rows;
    } catch (error) {
      console.error("Database error during get vehicles: ", error);
      throw new Error(`Database error during fetching vehicles: ${error}`)
    }
  };

  // Get Vehicle By Id
  public static getVehicleById = async (
    vehicleId: string
  ): Promise<IVehicle> => {
    try {
      const res = await pool.query(
        "SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status FROM vehicles WHERE id=$1",
        [vehicleId]
      );

      return res.rows[0];
    } catch (error) {
      console.error("Database error during get single vehicle by id");
      throw new Error(`Database error during fetching vehicle by id: ${error}`)
    }
  };

  // Create Vehicle
  public static createVehicle = async (
    payload: IVehicle
  ): Promise<IVehicle[]> => {
    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = payload;
    try {
      const res = await pool.query(
        "INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status",
        [
          vehicle_name,
          type,
          registration_number,
          daily_rent_price,
          availability_status,
        ]
      );

      return res.rows;
    } catch (error) {
      console.error("Database error during vehicle creation: ", error);
      throw new Error(`Database error during creating new vehicle: ${error}`)
    }
  };

  // Update Vehicle
  public static updateVehicle = async (
    vehicleId: number,
    payload: Partial<IVehicle>
  ): Promise<IVehicle> => {
    const updates = Object.entries(payload);
    const vehiclesKeysWithParam: string[] = [];
    const parameters: any[] = [];

    let count = 1;
    for (const [key, value] of updates) {
      if (value !== undefined) {
        vehiclesKeysWithParam.push(`${key}= $${count}`);
        parameters.push(value);
        count++;
      }
    }

    parameters.push(vehicleId);
    try {
      const res = await pool.query(
        `UPDATE vehicles SET ${vehiclesKeysWithParam.join(
          ", "
        )} WHERE id=$${count} RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status `,
        parameters
      );

      return res.rows[0];
    } catch (error) {
      console.error("Database error during updating vehicle: ", error);
      throw new Error(`Database error during updating vehicle: ${error}`)
    }
  };

  // Delete Vehicle
  public static deleteVehicle = async (vehicleId: string) => {
    try {
      const res = await pool.query("DELETE FROM vehicles WHERE id=$1", [
        vehicleId,
      ]);

      return res.rows[0];
    } catch (error) {
      console.error("Dabase error during delete vehicle: ", error);
    }
  };
}

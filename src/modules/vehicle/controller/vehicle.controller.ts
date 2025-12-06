import { NextFunction, Request, Response } from "express";
import asyncHandler from "../../../middlewares/asyncHandler";
import ApiResponse from "../../../utils/ApiResponse";
import VehicleService from "../service/vehicle.service";

export default class VehicleController {
  // Get Vehicles
  public static getVehicles = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const vehicles = await VehicleService.getVehicles();

        return res
          .status(200)
          .json(ApiResponse.ok(vehicles, "Vehicles retrived successfully"));
      } catch (error) {
        return res.status(400).json(ApiResponse.custom(400, "", error));
      }
    }
  );

  // Get Vehicle By Id
  public static getVehicleById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { vehicleId } = req.params;

      if (!vehicleId) {
        return res
          .status(400)
          .json(
            ApiResponse.badRequest(
              "Get single vehicle must have to provide valid vehicle Id"
            )
          );
      }

      try {
        const vehicle = await VehicleService.getVehicleById(vehicleId);

        if (!vehicle) {
          return res
            .status(200)
            .json(ApiResponse.ok({}, "No vehicle found to this Id"));
        }

        return res
          .status(200)
          .json(ApiResponse.ok({ ...vehicle }, "Vehicle retrive successfully"));
      } catch (error) {
        return res.status(500).json(ApiResponse.custom(500, "", error));
      }
    }
  );

  // Create Vehicle
  public static createVehicle = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const body = req.body;

      if (
        Object.keys(body).some(
          (key) =>
            body[key].length === 0 ||
            body[key] === undefined ||
            body[key] === null
        )
      ) {
        return res
          .status(400)
          .json(
            ApiResponse.badRequest(
              "Vehicle required all fields must have a valid value"
            )
          );
      }

      const newVehile = await VehicleService.createVehicle(body);

      return res.status(201).json(
        ApiResponse.created(
          {
            ...newVehile[0],
          },
          "Vehicle created successfully"
        )
      );
    }
  );

  // Update Vehicle
  public static updateVehicle = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { vehicleId } = req.params;
      const body = req.body;

      if (!vehicleId) {
        return res
          .status(400)
          .json(
            ApiResponse.badRequest(
              "Update vehicle must have a valid vehicle Id"
            )
          );
      }

      if (
        Object.keys(body).some(
          (key) =>
            body[key].length === 0 ||
            body[key] === undefined ||
            body[key] === null
        )
      ) {
        return res
          .status(400)
          .json(
            ApiResponse.badRequest(
              "Update vehicle required fields must have a valid value"
            )
          );
      }

      const isVehicleExists = await VehicleService.getVehicleById(vehicleId);

      if (!isVehicleExists) {
        return res
          .status(404)
          .json(ApiResponse.notFound("Vehicle not found for this vehicle Id"));
      }

      const updatedVehicle = await VehicleService.updateVehicle(
        Number(vehicleId),
        body
      );

      return res.status(200).json(
        ApiResponse.ok(
          {
            ...updatedVehicle,
          },
          "Vehicle updated successfully"
        )
      );
    }
  );

  // Delete Vechicle
  public static deleteVehicle = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { vehicleId } = req.params;

      if (!vehicleId) {
        return res
          .status(400)
          .json(
            ApiResponse.badRequest(
              "Delete vehicle must need a valid vehicle Id"
            )
          );
      }

      const isVehicleExists = await VehicleService.getVehicleById(vehicleId);

      if (!isVehicleExists) {
        return res
          .status(404)
          .json(ApiResponse.notFound("No vehicle found to delete"));
      }

      const deletedVehicle = await VehicleService.deleteVehicle(vehicleId);

      return res
        .status(200)
        .json(ApiResponse.deleted("Vehicle deleted successfully"));
    }
  );
}

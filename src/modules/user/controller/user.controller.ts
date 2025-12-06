import { NextFunction, Request, Response } from "express";
import asyncHandler from "../../../middlewares/asyncHandler";
import ApiResponse from "../../../utils/ApiResponse";
import UserService from "../service/user.service";
import BookingService from "../../booking/service/booking.service";

export default class UserController {
  // Get Users
  public static getUsers = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const users = await UserService.getUsers();

      return res
        .status(200)
        .json(ApiResponse.ok(users, "Users retrived successfully"));
    }
  );

  // Update User
  public static updateUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const body = req.body;
      const { userId } = req.params;
      const currentUser = req.user;
      const allowedRoles = ["customer", "admin"];
      const updateUserPayloadKeys = Object.keys(body);

      if (updateUserPayloadKeys.length === 0) {
        return res
          .status(400)
          .json(ApiResponse.badRequest("Update payload can not be empty!"));
      }

      if (
        updateUserPayloadKeys.some(
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
              "Update required fields must have a valid value"
            )
          );
      }

      if (!userId) {
        return res
          .status(400)
          .json(
            ApiResponse.badRequest(
              "Invalid request: Must provide a valid user Id in the URL."
            )
          );
      }

      if (!allowedRoles.includes(currentUser?.role!)) {
        return res
          .status(403)
          .json(ApiResponse.forbidden("Forbidden: You are not allowed"));
      }

      if (
        currentUser?.role?.toLowerCase() === "customer" &&
        body.role !== undefined
      ) {
        return res
          .status(403)
          .json(
            ApiResponse.forbidden(
              "Forbidden: You are not allowed to modify role"
            )
          );
      }

      if (
        currentUser?.role === "customer" &&
        Number(currentUser.userId) !== Number(userId)
      ) {
        return res
          .status(403)
          .json(
            ApiResponse.forbidden(
              "Forbidden: Please provide your valid user Id"
            )
          );
      }

      const updatedUser = await UserService.updateUser(userId, body);

      return res
        .status(200)
        .json(ApiResponse.ok(updatedUser, "User updated successfully"));
    }
  );

  // Delete User
  public static deleteUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { userId } = req.params;

      if (!userId) {
        return res
          .status(400)
          .json(
            ApiResponse.badRequest(
              "Bad request: Delete user must have a user Id"
            )
          );
      }

      const isUserExists = await UserService.getUserById(Number(userId));

      if (!isUserExists) {
        return res
          .status(404)
          .json(ApiResponse.notFound("Not found: User not found by this Id"));
      }

      const currentBooking = await BookingService.getBookingStatusByUserId(
        Number(userId)
      );

      if (currentBooking && currentBooking.status?.toLowerCase() === "active") {
        return res
          .status(400)
          .json(
            ApiResponse.badRequest("Bad request: User has active booking.")
          );
      }

      const deletedUser = await UserService.deleteUser(Number(userId));

      return res
        .status(200)
        .json(ApiResponse.deleted("User deleted successfully"));
    }
  );
}

import { Request, Response, NextFunction } from "express";
import config from "../config";
import ApiResponse from "../utils/ApiResponse";
import jwt, { JwtPayload } from "jsonwebtoken";

export default class Authenticate {
  private static verifyToken = (token: string) => {
    return jwt.verify(token, config.jwt_secret as string) as JwtPayload;
  };

  // Authenticate
  public static authentication = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const bearerToken = req.headers.authorization;

    if (!bearerToken || !bearerToken.startsWith("Bearer")) {
      return res
        .status(401)
        .json(
          ApiResponse.unauthorized(`Unauthorized: Token missing or malformed`)
        );
    }

    const token = bearerToken.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json(
          ApiResponse.badRequest("Unauthrozed: Token missing or malformed")
        );
    }

    try {
      const verifiedPayload = this.verifyToken(token);

      if (!verifiedPayload) {
        return res
          .status(403)
          .json(ApiResponse.unauthorized("Forbidden: You are not allowed!"));
      }

      req.user = {
        email: verifiedPayload.email,
        name: verifiedPayload.name,
        role: verifiedPayload.role,
      };

      next();
    } catch (error) {
      return res
        .status(401)
        .json(
          ApiResponse.unauthorized("Unauthorized: Invalid or expired token")
        );
    }
  };

  // Authorized Role
  public static authorization = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const role = req.user?.role;

      if (!role) {
        return res
          .status(403)
          .json(ApiResponse.forbidden("Forbidden: You are not allowed!"));
      }

      if (!allowedRoles.includes(role)) {
        return res
          .status(403)
          .json(
            ApiResponse.forbidden(
              "Forbidden: You are not allowed to this route"
            )
          );
      }

      next();
    };
  };
}

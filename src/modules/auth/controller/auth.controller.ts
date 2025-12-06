import { Request, Response, NextFunction } from "express";
import config from "../../../config";
import asyncHandler from "../../../middlewares/asyncHandler";
import ApiResponse from "../../../utils/ApiResponse";
import AuthService from "../service/auth.service";
import jwt, { JwtPayload } from "jsonwebtoken";
import UserService from "../../user/service/user.service";

interface IJwtPayload extends JwtPayload {
  name: string;
  email: string;
  role: string;
}

export default class AuthController {
  // Jwt sign in
  private static jwtSign = (jwtPayload: IJwtPayload) => {
    return jwt.sign(jwtPayload, config.jwt_secret as string, {
      expiresIn: "1d",
    });
  };

  // Signup User
  public static signUpUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { name, email, phone, password, role } = req.body;
      const userRoles: string[] = ["customer", "admin"];

      if (
        [name, email, phone, password, role].some(
          (item) => item.length === 0 || item === undefined || item === null
        )
      ) {
        return res
          .status(400)
          .json(
            ApiResponse.badRequest(
              "All required fileds must have a valid value!"
            )
          );
      }

      if (password.length < 6) {
        return res
          .status(400)
          .json(
            ApiResponse.badRequest("Password must have at least 6 characters")
          );
      }

      if (!userRoles.includes(role)) {
        return res
          .status(400)
          .json(
            ApiResponse.badRequest(
              "Role must have a valid role <'customer', 'admin'>"
            )
          );
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        return res
          .status(400)
          .json(
            ApiResponse.badRequest("Validation failed: Invalid email format")
          );
      }

      const newUser = await AuthService.signUpUser({
        name,
        email,
        phone,
        password,
        role,
      });

      return res
        .status(201)
        .json(
          ApiResponse.created(
            { ...newUser.rows[0] },
            "User registered successfully"
          )
        );
    }
  );

  // Signin User
  public static signInUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const {email, password} = req.body;

      if ([email, password].some((item) => item.length === 0 || item === undefined)) {
        return res
          .status(400)
          .json(
            ApiResponse.badRequest(
              "Required all fields must have a valid value"
            )
          );
      }

      const user = await UserService.getUserByEmail(email);

      if (user.rows.length === 0) {
        return res.status(404).json(ApiResponse.notFound("User not found"));
      }

      const payload: IJwtPayload = {
        userId: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        role: user.rows[0].role,
      };

      const token = this.jwtSign(payload);

      return res.status(200).json(
        ApiResponse.ok(
          {
            token,
            ...user.rows[0]
          },
          "Login successful"
        )
      );
    }
  );
}

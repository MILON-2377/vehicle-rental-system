import { NextFunction, Request, Response } from "express";
import asyncHandler from "../../../middlewares/asyncHandler";


export default class HealthController {
    public static check = asyncHandler(async(
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        return res.status(200).json({
            message:"Server health is ok"
        });
    });
}
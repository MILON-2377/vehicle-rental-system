import { Router } from "express";
import AuthController from "../controller/auth.controller";

const router = Router();

router.post("/signup", AuthController.signUpUser);
router.post("/signin", AuthController.signInUser);

export default router;

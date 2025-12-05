import { Router } from "express";
import HealthController from "../controller/health.controller";


const router = Router();

router.get("/", HealthController.check);

export default router;
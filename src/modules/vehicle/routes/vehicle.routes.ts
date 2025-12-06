import { Router } from "express";
import VehicleController from "../controller/vehicle.controller";
import Authenticate from "../../../middlewares/auth.middleware";

const router = Router();

router.get("/", VehicleController.getVehicles);
router.get("/:vehicleId", VehicleController.getVehicleById);


router.use(Authenticate.authentication, Authenticate.authorization("admin"));
router.post("/", VehicleController.createVehicle);
router.put("/:vehicleId", VehicleController.updateVehicle);
router.delete("/:vehicleId", VehicleController.deleteVehicle);

export default router;

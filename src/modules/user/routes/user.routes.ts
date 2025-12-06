import { Router } from "express";
import UserController from "../controller/user.controller";
import Authenticate from "../../../middlewares/auth.middleware";

const router = Router();

router.use(Authenticate.authentication);
router.get("/", Authenticate.authorization("admin"), UserController.getUsers);

router.put(
  "/:userId",
  Authenticate.authorization("admin", "customer"),
  UserController.updateUser
);
router.delete(
  "/:userId",
  Authenticate.authorization("admin"),
  UserController.deleteUser
);

export default router;

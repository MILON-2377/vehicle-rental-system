import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request extends JwtPayload {
      user?: {
        userId?: string;
        email?: string;
        name?: string;
        role?: string;
      }
    }
  }
}

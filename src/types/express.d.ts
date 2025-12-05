import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request extends JwtPayload {
      user?: {
        email?: string;
        name?: string;
        role?: string;
      }
    }
  }
}

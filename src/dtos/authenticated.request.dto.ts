import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

export interface AuthPayload extends JwtPayload {
  id: string
  email: string
}

export interface AuthenticatedRequest extends Request {
  user?: AuthPayload,
  refreshToken?: string
}

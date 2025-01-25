import { Response } from "express";
import httpStatusCodes from "./http.status.codes";

class ApiError extends Error {
  status: number;
  details: any;

  constructor(message: string, status: number = httpStatusCodes.INTERNAL_SERVER_ERROR, details: any = null) {
    super(message);
    this.status = status;
    this.details = details;

    // Set the prototype explicitly for extending built-in Error
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  send(res: Response): Response {
    return res.status(this.status).json({
      error: this.message,
      status: this.status,
      details: this.details,
    });
  }
}

export default ApiError;

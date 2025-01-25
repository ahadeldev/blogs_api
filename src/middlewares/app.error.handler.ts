import { Request, Response, NextFunction, } from "express";
import httpStatusCodes from "../shared/http.status.codes";
import ApiError from "../shared/api.error";

const appErrorhandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {

  if (err instanceof ApiError) {
    err.send(res); // Send standardized error response
    return;
  }

  // Generic error handler for unhandled errors
  const apiError = new ApiError(
    err.message || "Internal Server Error", 
    httpStatusCodes.INTERNAL_SERVER_ERROR,
    null
  );
  apiError.send(res);
  return;
}

export default appErrorhandler;
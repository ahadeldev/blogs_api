import { Request, Response, NextFunction } from "express";
import httpStatusCodes from "../shared/http.status.codes";

const routeNotFound = (req: Request, res: Response, _next: NextFunction) => {
  res.status(httpStatusCodes.NOT_FOUND).json({
    status: false,
    message: `Route ${req.originalUrl} Not Found`,
  })
}

export default routeNotFound;
import { NextFunction } from "express"
import ApiError from "../shared/api.error"
import httpStatusCodes from "../shared/http.status.codes";

/* 
  * function that handles returning error objects to th global error handler
  * @param { Error Object } err - Error object.
  * @param { NextFunction } next - functions that hand over the error to the next middleware in the stack.
  * @returns { Custom Error Object } - returns a custom ereor object.
*/
const returnError = (err: Error, next: NextFunction) => {
  if(err instanceof ApiError){
    return next(err);
  } else {
    const generalError = new ApiError(
      err.message || "an unexpected error occurred",
      httpStatusCodes.INTERNAL_SERVER_ERROR,
      null
    );
    return next(generalError);
  }
}

export default returnError;
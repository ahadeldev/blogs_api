import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../dtos/authenticated.request.dto";
import ApiError from "../shared/api.error";
import httpStatusCodes from "../shared/http.status.codes";
import AuthRepository from "../services/auth/auth.repository";

const authRepository = new AuthRepository();

const checkRefreshToken = async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const refreshToken = req.cookies?.refreshToken;
  if(!refreshToken){
    return next(new ApiError("not authorized, no refresh token, please login", httpStatusCodes.FORBIDDEN));
  }

  const tokenFound = await authRepository.findRefreshToken(refreshToken);
  if(!tokenFound || tokenFound.revoked === true){
    return next(new ApiError("not authorized, invalid refresh token, please login", httpStatusCodes.FORBIDDEN));
  }

  const currentDate = new Date();
  if(currentDate.getTime() > new Date(tokenFound.expires_in).getTime()){
    return next(new ApiError("not authorized, expired refresh token, please login", httpStatusCodes.FORBIDDEN));
  }

  req.refreshToken = refreshToken;
  next();
}

export default checkRefreshToken;
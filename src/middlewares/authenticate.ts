import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import UsersRepository from "../services/users/users.repository";
import { Response, NextFunction } from "express";
import { AuthenticatedRequest, AuthPayload } from "../dtos/authenticated.request.dto";
import ApiError from "../shared/api.error";
import httpStatusCodes from "../shared/http.status.codes";
import tokensConfig from "../config/tokens.config";

const usersRepository = new UsersRepository();

dotenv.config();
const authenticate = async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const accessToken = req.headers["authorization"]?.split(" ")[1];
  if(!accessToken){
    const error = new ApiError("not autherized, no access token, please login", httpStatusCodes.FORBIDDEN);
    return next(error);
  }

  const tokenCheck = await usersRepository.blackListedTokenCheck(accessToken);
  if(tokenCheck){
    const error = new ApiError("blacklisted token, please login", httpStatusCodes.FORBIDDEN);
    return next(error);
  }

  try {
    const verifiedToken = jwt.verify(accessToken, tokensConfig.jwtToken.secret as Secret);
    req.user = verifiedToken as AuthPayload;
    next();
  } catch (err: any) {
    if(err.name === "TokenExpiredError"){
      const error = new ApiError("expired token!, please login", httpStatusCodes.BAD_REQUSEST);
      return next(error);
    } else {
      const error = new ApiError("invalid token, please login", httpStatusCodes.BAD_REQUSEST);
      return next(error);
    }
  }

}

export default authenticate;
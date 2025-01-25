import jwt from "jsonwebtoken";
import crypto from "crypto";
import tokensConfig from "../config/tokens.config";
import ApiError from "../shared/api.error";
import httpStatusCodes from "../shared/http.status.codes";
import RefreshTokenType from "../types/refreshToken.type";

/* 
  * Generating new JWT token.
  * @param { userId: string, userEmail: string } userId, userEmail - The user id and the user email 
  * @returns { jwt string } - Returns a json web token string.
*/
const generateJwtToken = (userId: string, userEmail: string): string => {
  const payload = {
    id: userId,
    email: userEmail,
    sub: tokensConfig.jwtToken.subject,
    iss: tokensConfig.jwtToken.issuer,
    aud: tokensConfig.jwtToken.audience
  };

  const token: string = jwt.sign(
    payload, 
    tokensConfig.jwtToken.secret as string, {
      expiresIn: tokensConfig.jwtToken.expiresIn as string,
      algorithm: tokensConfig.jwtToken.algorithm as jwt.Algorithm
    }
  );

  if(!token){
    throw new ApiError("error generating token", httpStatusCodes.INTERNAL_SERVER_ERROR);
  }

  return token;
}

/* 
  * generate a refresh token type.
  * @returns { object } - Returns an refresh token type object.
*/
const generateRefreshToken = (): RefreshTokenType => {
  const token = crypto.randomBytes(tokensConfig.refreshTokenConfig.length).toString("hex");
  const expiresIn = Date.now() + (tokensConfig.refreshTokenConfig.expiration * 60 * 60 * 1000);
  return { token, expiresIn };
}

export { generateJwtToken, generateRefreshToken };
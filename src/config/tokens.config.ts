import dotenv from "dotenv";

dotenv.config();
const tokensConfig = {
  refreshTokenConfig: {
    length: 64,
    expiration: 7
  },
  jwtToken: {
    secret: process.env.JWT_SECRET,
    algorithm: "HS256", // HMAC using SHA-256 (Defalut algorithm)
    expiresIn: "5m" as string, // Expiry time for the token
    issuer: "BlogsAppApi", // Issuer of the token
    audience: "BlogsAppApiUsers", // Intended audience for the token
    subject: "user auth", // The subject of the token (userId)
  }
};

export default tokensConfig;
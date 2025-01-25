import AuthRepository from "./auth.repository";
import User from "../../dtos/user.dto";
import LogginUser from "../../dtos/loginUser.dto";
import { hashPassword, comparePassword } from "../../utils/password.utils";
import { generateJwtToken, generateRefreshToken } from "../../utils/token.utils";
import ApiError from "../../shared/api.error";
import httpStatusCodes from "../../shared/http.status.codes";
import LoginUserType from "../../types/loginUser.type";
import LogoutResponse from "../../types/logout.type";

class AuthServices {

  constructor(private readonly authRepository: AuthRepository){}

  // register user handler
  async registerUser(name: string, email: string, username: string, password: string): Promise<User> {
    
    // check if the email or username exists
    const userExists = await this.authRepository.findUserByEmailOrUsername(email, username);
    if(userExists){
      throw new ApiError("invalid email or username", httpStatusCodes.UNPROCESSABLE_ENTITY);
    }
    
    // validate password length
    if(!password || password.length < 6){
      throw new ApiError("password required and must be at least 6 chars long", httpStatusCodes.UNPROCESSABLE_ENTITY);
    }

    // hash the password
    const hashedPassword = await hashPassword(password);

    const userData = {
      name, email, username, password: hashedPassword
    };

    // Save user to database
    const newUser = this.authRepository.createUser(userData);
    return newUser;
  }

  // login user handler
  async loginUser(loginData: LogginUser): Promise<LoginUserType>{
    // check if the user exists
    const userExists = await this.authRepository.findUserByEmailOrUsername("", loginData.username);
    if(!userExists){
      throw new ApiError("username not found", httpStatusCodes.NOT_FOUND);
    }

    // check if password is correct
    const correctPassword = await comparePassword(loginData.password, userExists.password);
    if(!correctPassword){
      throw new ApiError("wrong password", httpStatusCodes.BAD_REQUSEST);
    }

    // generate refresh token
    const refreshToken = generateRefreshToken();
    // save refresh token in database
    const savedRefreshToken = await this.authRepository.saveRefreshToken(refreshToken.token, refreshToken.expiresIn, userExists.user_id);

    // generate jwt token
    const jwtToken = generateJwtToken(userExists.user_id, userExists.email);

    const loggedInUser: LoginUserType = {
      userName: userExists.username,
      email: userExists.email,
      accessToken: jwtToken,
      refreshToken: savedRefreshToken.token
    }
    
    return loggedInUser;
  }

  // refresh access token handler
  async refreshAccessToken(tokenBody: string){
    const refTokenFound = await this.authRepository.findRefreshToken(tokenBody);
    const user = await this.authRepository.getUserById(refTokenFound!.user_id)
    const newJwtToken = generateJwtToken(refTokenFound!.user_id, user!.email);
    return newJwtToken;
  }

  // logout user handler
  async logoutUser(userId: string, tokenBody: string): Promise<LogoutResponse>{
    const revokedRefreshToken = await this.authRepository.revokeRefreshToken(userId);
    const blacklistedAccessToken = await this.authRepository.blacklistAccessToken(tokenBody);
    if(!revokedRefreshToken || !blacklistedAccessToken){
      throw new ApiError("error loging out, please try again", httpStatusCodes.INTERNAL_SERVER_ERROR);
    }
    
    return { userId, status: true };
  }
}

export default AuthServices;
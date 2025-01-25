import { Request, Response, NextFunction } from "express";
import AuthServices from "./auth.services";
import RegisterUser from "../../dtos/registerUser.dto";
import LogginUser from "../../dtos/loginUser.dto";
import { AuthenticatedRequest } from "../../dtos/authenticated.request.dto";
import returnError from "../../utils/return.error";
import ApiError from "../../shared/api.error";
import ApiResponse from "../../shared/api.response";
import httpStatusCodes from "../../shared/http.status.codes";


class AuthControllers {

  constructor(private readonly authServices: AuthServices){}

  // @desc    Register user
  // @route   POST /api/v1/auth/register
  // @access  Public
  async registerUserController(req: Request, res: Response, next: NextFunction){
    const userData: RegisterUser = req.body;
    if(Object.keys(userData).length < 4){
      const err = new ApiError("name, email, username and password are required", httpStatusCodes.UNPROCESSABLE_ENTITY);
      returnError(err, next);
    }

    try {
      const newUser = await this.authServices.registerUser(userData.name, userData.email, userData.username, userData.password);
      const response = new ApiResponse(httpStatusCodes.RESOURCE_CREATED, "USER SAVED", [newUser]);
      response.send(res);
    } catch (err: any) {
      returnError(err, next);
    }
  }

  // @desc    Login user
  // @route   POST /api/v1/auth/login
  // @access  Public
  async loginUserController(req: Request, res: Response, next: NextFunction){
    const loginData: LogginUser = req.body;
    if(!loginData || Object.keys(loginData).length < 2){
      const err = new ApiError("username and password are required", httpStatusCodes.UNPROCESSABLE_ENTITY);
      returnError(err, next);
    }
    try {
      const loggedInUser = await this.authServices.loginUser(loginData);
      const response = new ApiResponse(httpStatusCodes.RESOURCE_CREATED, "USER CREATED", [loggedInUser]);
      res.cookie("refreshToken", loggedInUser.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 60 * 60 * 1000
      });
      response.send(res);
    } catch (err: any) {
      returnError(err, next);
    }
  }

  // @desc    Refresh access token
  // @route   POST /api/v1/auth/refresh
  // @access  Private
  async refreshAccessTokenController(req: AuthenticatedRequest, res: Response, next: NextFunction){
    const refreshToken = req.refreshToken;
    try {
      const newToken = await this.authServices.refreshAccessToken(refreshToken!);
      const response = new ApiResponse(httpStatusCodes.OK, "NEW JWT", [newToken]);
      response.send(res);
    } catch (err: any) {
      returnError(err, next);
    }
  }

  // @desc    Logout user
  // @route   POST /api/v1/auth/logout
  // @access  Private
  async logoutUserController(req: AuthenticatedRequest, res: Response, next: NextFunction){
    const accessToken = req.headers["authorization"]?.split(" ")[1];
    const userId = req.user!.id;
    try {
      const logoutUser = await this.authServices.logoutUser(userId, accessToken!);
      const response = new ApiResponse(httpStatusCodes.OK, "USER LOGOUT", [logoutUser.status]);
      response.send(res);
    } catch (err: any) {
      returnError(err, next);
    }
  }
}

export default AuthControllers;
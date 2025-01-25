import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../dtos/authenticated.request.dto";
import NewUserDetails from "../../dtos/updateUser.dto";
import UsersServices from "./users.services";
import returnError from "../../utils/return.error";
import ApiResponse from "../../shared/api.response";
import httpStatusCodes from "../../shared/http.status.codes";

class UsersControllers {
  constructor(private readonly usersServices: UsersServices){}

  // @desc    Get user profile details
  // @route   GET POST /api/v1/users/profile
  // @access  Private
  async getUserProfileController(req: AuthenticatedRequest, res: Response, next: NextFunction){
    const verifiedUser = req.user;
    try {
      const userProfile = await this.usersServices.getUserPofile(verifiedUser!.id);
      const response = new ApiResponse(httpStatusCodes.OK, "USER PROFILE", [userProfile]);
      response.send(res);
    } catch (err: any) {
      returnError(err, next);
    }
  }

  // @desc    Update user profile details
  // @route   PUT /api/v1/users/profile
  // @access  Private
  async updateUserProfileController(req: AuthenticatedRequest, res: Response, next: NextFunction){
    const verifiedUser = req.user;
    const newUserDetails: NewUserDetails = req.body
    try {
      const updatedUser = await this.usersServices.updateUserProfile(verifiedUser!.id, newUserDetails.name, newUserDetails.username, newUserDetails.email);
      const response = new ApiResponse(httpStatusCodes.OK, "UPDATED USER PROFILE", [updatedUser]);
      response.send(res);
    } catch (err: any) {
      returnError(err, next);
    }
  }

  // @desc    Delete user account
  // @route   DELETE /api/v1/users/profile/delete
  // @access  Private
  async deleteUserAccountController(req: AuthenticatedRequest, res: Response, next: NextFunction){
    const verifiedUser = req.user;
    try {
      const userDeleted = await this.usersServices.deleteUserAccount(verifiedUser!.id);
      const response = new ApiResponse(httpStatusCodes.OK, "DELETE USER", [userDeleted.messgae]);
      response.send(res);
    } catch (err: any) {
      returnError(err, next);
    }
  }

  // @desc    Deactivate user account
  // @route   DELETE /api/v1/users/profile/deactivate
  // @access  Private
  async deactivateUserAccountController(req: AuthenticatedRequest, res: Response, next: NextFunction){
    const verifiedUser = req.user;
    try {
      const userDeactivated = await this.usersServices.deactivateUserAccount(verifiedUser!.id);
      const response = new ApiResponse(httpStatusCodes.OK, "DEACTIVE USER ACCOUNT", [`${userDeactivated?.name} account deactivated`]);
      response.send(res);
    } catch (err: any) {
      returnError(err, next);
    }
  }
}

export default UsersControllers;
import UsersRepository from "./users.repository";
import UserProfile from "../../dtos/user.profile.dto";
import User from "../../dtos/user.dto";
import ApiError from "../../shared/api.error";
import httpStatusCodes from "../../shared/http.status.codes";

class UsersServices {
  constructor(private readonly usersRepository: UsersRepository){}

  // get user profile handler
  async getUserPofile(userId: string): Promise<UserProfile | null>{
    const user = await this.usersRepository.getUserData(userId);
    if(!user){
      throw new ApiError("user not found or inactive", httpStatusCodes.NOT_FOUND);
    }
    const userProfile: UserProfile = {
      name: user?.name,
      email: user?.email,
      username: user?.username,
      role: user?.role
    };
    return userProfile;
  }

  // update user profile handler
  async updateUserProfile(userId: string, newName?: string, newUserName?: string, newEmail?: string): Promise<User | null>{
    if(!newName && !newUserName && !newEmail){
      throw new ApiError("one field required to update (name, username or email)", httpStatusCodes.UNPROCESSABLE_ENTITY);
    }

    const updatedUser = await this.usersRepository.updateUserDetails(userId, newName, newUserName, newEmail);
    if(!updatedUser){
      throw new ApiError("error updating user details", httpStatusCodes.INTERNAL_SERVER_ERROR);
    }

    return updatedUser;
  }

  // delete user account handler
  async deleteUserAccount(userId: string){
    const deleteUser = await this.usersRepository.deleteUserAccount(userId);
    if(deleteUser === null){
      throw new ApiError("error deleteing user account, please try again", httpStatusCodes.INTERNAL_SERVER_ERROR);
    }
    return deleteUser;
  }

  // deactivate user account handler
  async deactivateUserAccount(userId: string): Promise<User | null>{
    const deactivatedUser = await this.usersRepository.deactivateUserAccount(userId);
    if(!deactivatedUser){
      throw new ApiError("error deactivating user account", httpStatusCodes.INTERNAL_SERVER_ERROR);
    }
    return deactivatedUser;
  }
  
}

export default UsersServices;
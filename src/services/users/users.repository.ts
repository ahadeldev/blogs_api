import { client } from "../../utils/db.utils";
import User from "../../dtos/user.dto";
import NewUserDetails from "../../dtos/updateUser.dto";
import DeleteUserResponse from "../../dtos/deleteUserResponse.dto";

class UsersRepository {
  
  // get user data
  async getUserData(userId: string): Promise<User | null>{
    const user = await client.user.findUnique({where: {user_id: userId, is_active: true}});
    return user;
  }

  // check if token is blacklisted
  async blackListedTokenCheck(tokenBody: string): Promise<string | undefined>{
    const tokenFound = await client.logoutToken.findFirst({
      where: { token: tokenBody }
    });
    const token = tokenFound?.token;
    return token;
  }

  // updaate user details
  async updateUserDetails(userId: string, newName?: string, newUserName?: string, newEmail?: string): Promise<User>{
    const newUserDetails: NewUserDetails = {};

    if(newName) newUserDetails.name = newName
    if(newUserName) newUserDetails.username = newUserName
    if(newEmail) newUserDetails.email = newEmail

    const updatedUser = await client.user.update({
      where: { user_id: userId },
      data: newUserDetails
    });

    return updatedUser;
  }

  // deactivate user account
  async deactivateUserAccount(userId: string): Promise<User> {
    // delete user refresh token 
    await client.refreshToken.delete({
      where: { user_id: userId }
    });
    const deactivatedUserAccount = await client.user.update({
      where: { user_id: userId},
      data: {is_active: false}
    })
    return deactivatedUserAccount;
  }

  // delete user account and related data (like comments, blogs, etc.) from the database
  async deleteUserAccount(userId: string): Promise<DeleteUserResponse | null>{

    // delete user refresh token 
    const userRefToken = await client.refreshToken.delete({
      where: { user_id: userId }
    });

    // delete user account data
    const user = await client.user.delete({
      where: { user_id: userId }
    });

    if(!user || !userRefToken){
      return null;
    }

    const response: DeleteUserResponse = {
      status: true,
      messgae: `account ${userId} deleteed`
    };

    return response;
  }
}

export default UsersRepository;